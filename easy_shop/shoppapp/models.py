import os
from django.db import models
from django.utils import timezone
from django.dispatch import receiver

# Create your models here.
class User(models.Model):
    # link to adim users and make name primary key
    name = models.CharField(max_length=50)
    friends = models.ManyToManyField('User', blank=True)

    def __str__(self):
        return self.name

class Ingredient(models.Model):
    name = models.CharField(max_length=50)
    # add choices to the charfield for location
    location = models.ForeignKey('Location',on_delete=models.SET_DEFAULT, default=1)
    # location =models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Meal(models.Model):
    name = models.CharField(max_length=256)
    recipe = models.TextField(max_length=3000)
    image = models.ImageField(upload_to='meal_pics/', default=None)
    ingredients = models.ManyToManyField(Ingredient, through='MealIngredients')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    
    @receiver(models.signals.post_delete, sender='shoppapp.Meal')
    def auto_delete_file_on_delete(sender, instance, **kwargs):
        """
        Deletes file from filesystem
        when corresponding `Meal` object is deleted.
        """
        if instance.image:
            if os.path.isfile(instance.image.path):
                os.remove(instance.image.path)

    @receiver(models.signals.pre_save, sender='shoppapp.Meal')
    def auto_delete_file_on_change(sender, instance, **kwargs):
        """
        Deletes old file from filesystem
        when corresponding `Meal` object is updated
        with new file.
        """
        if not instance.pk:
            return False

        try:
            old_file = Meal.objects.get(pk=instance.pk).image
        except Meal.DoesNotExist:
            return False

        new_file = instance.image
        if not old_file == new_file:
            if os.path.isfile(old_file.path):
                os.remove(old_file.path)
    
    def __str__(self):
        return self.name

class Order(models.Model):
    ordered_date = models.DateTimeField(default=timezone.now())
    ingredients = models.ManyToManyField(Ingredient, through='OrderIngredients')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, default=None)

    def __str__(self):
        return (f'{self.creator}, {self.ordered_date}')

class MealIngredients(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    
    def __str__(self):
        return f'{self.meal}: {self.quantity}, {self.ingredient}'

class OrderIngredients(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    
    def __str__(self):
        return f'{self.order}: {self.quantity}, {self.ingredient}'

class Location(models.Model):
    name = models.CharField(max_length=50)
    rank = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.rank} - {self.name}'