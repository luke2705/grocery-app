from django.shortcuts import render
from django.views.generic import TemplateView
from shoppapp.models import User, Ingredient, Meal, MealIngredients, Order, OrderIngredients, Location
import json
from django.http import HttpResponse


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
        for ingredient in Ingredient.objects.all():
            ingredients[ingredient.name] = ingredient.location.name
        context['Ingredients'] = ingredients
        
        context['Meals'] = Meal.objects.all()
        return context

def order(request):
    return render(request, 'order.html', context={'cart':json.loads(request.POST['hidden_input'])})
