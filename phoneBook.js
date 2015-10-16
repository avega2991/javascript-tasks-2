'use strict';

var phoneBook = []; // Здесь вы храните записи как хотите

/*
   Функция добавления записи в телефонную книгу.
   На вход может прийти что угодно, будьте осторожны.
*/
module.exports.add = function add(name, phone, email) {

    if (!isNameValid(name) || !isPhoneValid(phone) || !isEmailValid(email)) {
        console.log('Wrong args: add(name, phone, email)');
        return false;
    }

    if (exists(name, phone, email)) {
        console.log('Contact already exists...');
        return false;
    }

    phoneBook.push({
        name: name,
        phone: phone,
        email: email
    });
    return true;

};

/*
   Функция поиска записи в телефонную книгу.
   Поиск ведется по всем полям.
*/
module.exports.find = function find(query) {

    var resultList = [];
    if (isNameValid(query) || isPhoneValid(query) || isEmailValid(query)) {
        for (var i = 0; i < phoneBook.length; ++i) {
            var elem = phoneBook[i];
            var nameExists = (elem.name.indexOf(query) > -1);
            var phoneExists = (elem.phone.indexOf(query) > -1);
            var emailExists = (elem.email.indexOf(query) > -1);
            if (nameExists || phoneExists || emailExists) {
                console.log(elem);
                resultList.push(i);
            }
        }
    } else {
        console.log('Wrong query --> find(query)');
        return [];
    }

    return resultList;

};

/*
   Функция удаления записи в телефонной книге.
*/
module.exports.remove = function remove(query) {

    var targetIndexList = module.exports.find(query);

    targetIndexList.forEach(function (index) {
        phoneBook.splice(index, 1);
    });
    console.log(targetIndexList.length + ' elements are deleted');

};

/*
   Функция импорта записей из файла (задача со звёздочкой!).
*/
module.exports.importFromCsv = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    data = data.split('\n');
    data = data.filter(isEmpty);

    var addCount = 0;
    data.forEach(function (elem) {
        var args = elem.split(';');
        var isAdded = module.exports.add(args[0].trim(), args[1].trim(), args[2].trim());
        isAdded && ++addCount;
    });

    console.log(addCount + ' contacts are added');
};

/*
   Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
*/
module.exports.showTable = function showTable() {

    var borderElems = {
        topLeft: '┌',
        topCenter: '┬',
        topRight: '┐',

        middleLeft: '├',
        middleCenter: '┼',
        middleRight: '┤',

        bottomLeft: '└',
        bottomCenter: '┴',
        bottomRight: '┘',

        vertical: '│',
        horizontal: '─'
    };

    var nameWidth = 0;
    var phoneWidth = 20;
    var emailWidth = 0;
    phoneBook.forEach(function (elem) {
        nameWidth = (elem.name.length >= nameWidth) ? elem.name.length : nameWidth;
        emailWidth = (elem.email.length >= emailWidth) ? elem.email.length : emailWidth;
    });

    var nameBorder = Array(nameWidth + 3).join(borderElems.horizontal);
    var phoneBorder = Array(phoneWidth + 2).join(borderElems.horizontal);
    var emailBorder = Array(emailWidth + 3).join(borderElems.horizontal);
    var topBorder = borderElems.topLeft + nameBorder +
        borderElems.topCenter + phoneBorder +
        borderElems.topCenter + emailBorder +
        borderElems.topRight;
    var middleBorder = borderElems.middleLeft + nameBorder +
        borderElems.middleCenter + phoneBorder +
        borderElems.middleCenter + emailBorder +
        borderElems.middleRight;
    var bottomBorder = borderElems.bottomLeft + nameBorder +
        borderElems.bottomCenter + phoneBorder +
        borderElems.bottomCenter + emailBorder +
        borderElems.bottomRight;

    console.log(topBorder);
    console.log(borderElems.vertical + ' Name ' + Array(nameWidth - 3).join(' ') +
        borderElems.vertical + ' Phone' + Array(phoneWidth - 4).join(' ') +
        borderElems.vertical + ' Email ' + Array(emailWidth - 4).join(' ') +
        borderElems.vertical);
    console.log(middleBorder);

    phoneBook.forEach(function (elem) {
        console.log(borderElems.vertical + ' ' + elem.name +
            Array(nameWidth - elem.name.length + 2).join(' ') +
            borderElems.vertical + ' ' + elem.phone +
            Array(phoneWidth - elem.phone.length + 1).join(' ') +
            borderElems.vertical + ' ' + elem.email +
            Array(emailWidth - elem.email.length + 2).join(' ') +
            borderElems.vertical);
    });
    console.log(bottomBorder);

};

function isNameValid(name) {
    var regexp = /[A-zА-Яа-яёЁ\d ]+/;
    return regexp.test(name);
}

function isPhoneValid(phone) {
    var regexp = /^(\+?\d{1,3}[\- ]?)?((\(\d{3}\))|(\d{3}))[\- ]?\d{3}[\- ]?\d{1}[\- ]?\d{3}$/;
    return regexp.test(phone);
}


function isEmailValid(email) {
    var regexp = /^[A-z\d\-\_]+@([A-zА-Яа-яёЁ\d\-]+\.)+[A-zА-Яа-яёЁ]+$/;
    return regexp.test(email);
}

function isEmpty(str) {
    if (str != '') {
        return true;
    }
}

function exists(name, phone, email) {
    var nameArray = module.exports.find(name);
    var phoneArray = module.exports.find(phone);
    var emailArray = module.exports.find(email);

    return (nameArray.length && phoneArray.length && emailArray.length);
}
