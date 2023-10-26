from django.contrib import admin

from .models import Employee

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('last_name', 'position', 'salary', 'date_of_birth')
    list_filter = ('position', 'date_of_birth')
    search_fields = ('last_name',)
