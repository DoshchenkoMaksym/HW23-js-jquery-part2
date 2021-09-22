
let $todoList = $('.todo__list');
let $form = $('.form');
let $formInput = $('.form__input');
let $list = $('.todo__list');
$(document).ready(render(getTodos, $list))

async function getTodos() {
    let x = await $.ajax({
        url: 'http://localhost:3000/todos',
        dataType: "json",
        success: function (data) {
            return data;
        }
    });
    return x;
};

async function render(getRequest, $inElem) {
    let arrTodos = await getRequest();
    console.log(arrTodos)
    let $innerHTML = $inElem.html();
    $.each(arrTodos, item => {
        console.log(arrTodos[item].completed)
        if (arrTodos[item].completed === false) {
            $innerHTML += `<li class="todo__list-item" data-id="${arrTodos[item].id}" data-status="${arrTodos[item].completed}">${arrTodos[item].title}<div class="cancel"></div></li>`
        } else {
            $innerHTML += `<li class="todo__list-item active" data-id="${arrTodos[item].id}" data-status="${arrTodos[item].completed}">${arrTodos[item].title}<div class="cancel"></div></li>`
        }
    })
    $inElem.html($innerHTML);
};
function removeTodo(event, dataDelete) {
    let itemId = +event.target.closest('.todo__list-item').getAttribute('data-id');
    event.target.closest('.todo__list-item').remove();
    dataDelete(itemId);
};
async function deleteItemInData(id) {
    let x = await $.ajax({
        url: `http://localhost:3000/todos/${id}`,
        type: 'DELETE'
    });
};
$list.on('click', event => {
    if (event.target.tagName === 'DIV') {
        removeTodo(event, deleteItemInData);
    } else {
        event.target.classList.toggle('active');
        changeStatus(+event.target.getAttribute('data-id'), event.target.getAttribute('data-status'), event.target.textContent);
        if (event.target.getAttribute('data-status') === 'true') {
            event.target.setAttribute('data-status', false)
        } else {
            event.target.setAttribute('data-status', true)
        }
    }
});


function valueInObj($elem) {
    return {
        'title': $elem.val(),
        'completed': false
    }
};

function changingTodo(elemStatus, elemText) {
    if (elemStatus === 'true') {
        return {
            'title': elemText,
            'completed': false
        }
    } else if (elemStatus === 'false') {
        return {
            'title': elemText,
            'completed': true
        }
    };
};

async function createTodo($value) {
    let todoResponse = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(valueInObj($value))
    });
    let getTodo = await todoResponse.json();
    return getTodo;
};

async function createRender(getRequest, $inputValue, $inElem) {
    let todo = await getRequest($inputValue);
    let valueInElem = $inElem.html();
    valueInElem += `<li class="todo__list-item" data-id="${todo.id}" data-status="${todo.completed}">${todo.title}<div class="cancel"></div></li>`;
    $inElem.html(valueInElem);
};

async function changeStatus(id, status, text) {
    let request = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(changingTodo(status, text))
    });
};

$form.on('submit', event => {
    event.preventDefault();
    createRender(createTodo, $formInput, $todoList);
    $form.trigger("reset");
});






