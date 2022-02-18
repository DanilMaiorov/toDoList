const todoControl = document.querySelector('.todo-control');
const headerInput = document.querySelector('.header-input');
const todoList = document.querySelector('.todo-list');
const todoCompleted = document.querySelector('.todo-completed');
const empty = document.querySelector('.empty-message')
let toDoData = [];
console.log();

function animate ({timing, draw, duration}) {
    let start = performance.now();
    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;
        let progress = timing(timeFraction)
        draw(progress);
        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    });
}
function render () {
    todoList.innerHTML = '';
    todoCompleted.innerHTML = '';
    toDoData.forEach(function(item, index){
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.innerHTML = '<span class="text-todo">' + item.text + '</span>' +
            '<div class="todo-buttons">' + 
            '<button class="todo-remove"></button>' + 
            '<button class="todo-complete"></button>' + 
            '</div>';
            localStorage.setItem('toDoData', JSON.stringify(toDoData));
            if (item.completed) {
                todoCompleted.append(li);
            } else {
                todoList.append(li);
            }
            li.querySelector('.todo-complete').addEventListener('click', function (){
                item.completed = !item.completed;
                render();
            });
            li.querySelector('.todo-remove').addEventListener('click', function(){
                toDoData.splice(index, 1);
                localStorage.removeItem('toDoData'); 
                render();
            });
    });   
};
function reload () {
    if (localStorage.key('toDoData')) {
        toDoData = JSON.parse(localStorage.getItem('toDoData'));
        render();
    }
}
function showMessage () {
    animate({
        duration: 500,
        timing(timeFraction) {
        return timeFraction;
        },
        draw(progress) {
            empty.style.display = 'flex'
            empty.style.opacity = progress; 
            headerInput.parentNode.parentNode.parentNode.style.background = '#FFDEEF'
        }
    });
}
function hideMessage() {
    animate({
        duration: 500,
        timing(timeFraction) {
            return timeFraction;
        },
        draw(progress) {
            empty.style.opacity = 1 - progress;
            headerInput.parentNode.parentNode.parentNode.style.background = '#E4EFAF'
            setTimeout(() => {
                empty.style.display = 'none';
            }, 500);
        }
    })
}
headerInput.addEventListener('input', () => {
    hideMessage()
})

todoList.innerHTML = '';
todoCompleted.innerHTML = '';

todoControl.addEventListener('submit', function(event) {
    event.preventDefault();
    const newToDo = {
        text: headerInput.value,
        completed: false,
    }
    if (headerInput.value.trim() === ''){
       showMessage()
    } else {
        toDoData.push(newToDo);
        hideMessage()
    }
        todoControl.reset()
        render();
});

reload();