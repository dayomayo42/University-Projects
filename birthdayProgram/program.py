import calendar 
from datetime import datetime

# Variables 

# Запрашиваем у пользователя день рождения
birthDay = int(input("Введите день рождения: "))

# Запрашиваем у пользователя месяц рождения
birthMonth = int(input("Введите месяц рождения: "))

# Запрашиваем у пользователя год рождения
birthYear = int(input("Введите год рождения: "))

# Functions

# Вычисляем день недели
def getDayOfTheWeek():
    birthDateWeekDay = datetime(birthYear, birthMonth, birthDay).date().isoweekday()
    print("День недели вашей даты рождения - " + str(birthDateWeekDay))

# Вычисляем високосный ли год
def getIsBirthYearLeap():
    isLeapYear = calendar.isleap(birthYear)
    print("Был ли год вашего рождения високосным - " + str(isLeapYear))

# Вычисляем сколько сейчас лет пользователю
def getUserAge():
    birthDate = datetime(birthYear, birthMonth, birthDay)
    difference = (datetime.now() - birthDate).days // 365 
    print("Текущее количество лет пользователю - " +str(difference))

# Печатаем цифры звездочками
def printNumberStars(number):
    digits = [
        [" *** ", "*   *", "*   *", "*   *", " *** "], #0
        ["  *  ", "* *  ", "  *  ", "  *  ", "*****"], #1
        [" *** ", "*   *", "   * ", "  *  ", "*****"], #2
        [" *** ", "*   *", "  ** ", "*   *", " *** "], #3
        ["  * ", "  ** ", " * * ", "*****", "   * "], #4
        ["*****", "*    ", "**** ", "    *", "**** "], #5
        [" *** ", "*    ", "**** ", "*   *", " *** "], #6
        ["*****", "    *", "   * ", "  *  ", " *   "], #7
        [" *** ", "*   *", " *** ", "*   *", " *** "], #8
        [" *** ", "*   *", " ****", "    *", " *** "] #9
    ]
    for row in range(5):
        line = ''.join(digits[int(digit)][row] + ' ' for digit in number)
        print(line)  

# Выводим ответы
getDayOfTheWeek()
getIsBirthYearLeap()
getUserAge()
printNumberStars(f"{birthDay:02}")
printNumberStars(f"{birthMonth:02}")
printNumberStars(f"{birthYear}")