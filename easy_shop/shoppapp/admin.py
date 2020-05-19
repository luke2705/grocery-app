from django.contrib import admin
from shoppapp.models import User, Ingredient, Meal, MealIngredients, Order, OrderIngredients, Location

# Register your models here.
admin.site.register(Ingredient)
admin.site.register(Meal)
admin.site.register(MealIngredients)
admin.site.register(Order)
admin.site.register(OrderIngredients)
admin.site.register(Location)