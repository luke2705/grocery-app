import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt


from easy_shop.forms import UserForm
from shoppapp.models import User, Ingredient, Meal, MealIngredients, Order, OrderIngredients, Location

class indexTV(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # bundle the recipe for each meal
        recipes={}
        for meal in Meal.objects.all():
            ingredient_list = {}
            # mealingredients is the 'through' field that connects meals to their ingredients
            for ingredient in Ingredient.objects.filter(mealingredients__meal=meal):
                quantity = MealIngredients.objects.get(meal=meal, ingredient=ingredient).quantity
                ingredient_list[ingredient.name]= quantity
            recipes[meal.name]={'ingredients':ingredient_list}
        context['recipes']=recipes

        # create locations dict as location:rank
        locations = {}
        for location in Location.objects.all():
            locations[location.name] = location.rank
        context['Locations'] = locations
        

        # create ingredients dict as ingredient:location
        ingredients = {}
        if self.request.user.is_active:
            queryset = Ingredient.objects.filter(Q(user=None)|Q(user=self.request.user))
        else:
            queryset = Ingredient.objects.filter(user=None)
        for ingredient in queryset:
            ingredients[ingredient.name] = ingredient.location.name
        context['Ingredients'] = ingredients
        
        context['Meals'] = Meal.objects.all()
        return context

def order(request):
    return render(request, 'order.html', context={'cart':json.loads(request.POST['hidden_input'])})

def user_login(request):
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user:
            if user.is_active:
                login(request,user)
                return HttpResponseRedirect(reverse('home'))
            else:
                return HttpResponse("Your account is not active.")
        else:
            print("Someone tried to login and failed.")
            print("They used username: {} and password: {}".format(username,password))
            return HttpResponse("Invalid login details supplied.")

    else:
        return render(request, 'login.html', {})

@login_required
def user_logout(request):
    logout(request)
    return HttpResponseRedirect(reverse('home'))


def register(request):
    registered = False
    if request.method == 'POST':
        user_form = UserForm(request.POST)
        if user_form.is_valid():
            user = user_form.save()
            user.set_password(user.password)
            user.save()
            registered = True
        else:
            print(user_form.errors)
    else:
        user_form = UserForm()

    return render(request,'registration.html',
                          {'user_form':user_form,
                           'registered':registered})

@csrf_exempt

def items(request):
    if request.method =='POST':
        data = json.loads(request.body)
        location = Location.objects.filter(name=data['location'])[0]
        item = Ingredient(name=data['item'], location = location, user=request.user)
        item.save()
        return JsonResponse({}, status=201, safe=False)
    else:
        context = {}
        context['Locations'] = locationsDict()

        
        # create ingredients dict as ingredient:location
        ingredients = {}
        if request.user.is_active:
            queryset = Ingredient.objects.filter(Q(user=None)|Q(user=request.user))
        else:
            queryset = Ingredient.objects.filter(user=None)
        for ingredient in queryset:
            ingredients[ingredient.name] = ingredient.location.name
        context['Ingredients'] = ingredients
        return render(request, 'items.html', context)

def locationsDict():
        # create locations dict as location:rank
        locations = {}
        for location in Location.objects.all():
            locations[location.name] = location.rank
        return locations