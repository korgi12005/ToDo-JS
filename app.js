//document.addEventListener('DOMContentLoaded', loadTodos);
const form=document.querySelector('button');
let maxID=0;
form.addEventListener('click', createIl);

fetch('https://jsonplaceholder.typicode.com/users')//Загружаем пользователей
    .then(resp => {
        if(resp.ok){
            return resp.json();
        } else{
            throw new Error('Failed to fetch');
        }
    })
    .then((obj) =>{
         obj.map(nam =>{
            const sel=document.querySelector('select');
            const opt=document.createElement('option');
            opt.setAttribute('id',nam.id);
            opt.innerText=nam.name;
            sel.append(opt);
        })
    })
    .catch(console.error);


fetch('https://jsonplaceholder.typicode.com/todos')//загружаем ToDo
    .then(resp => {
        if(resp.ok){
            return resp.json();
        } else{
            throw new Error('Failed to fetch');
        }
    })
    .then((obj) =>{
         obj.map(todos =>{
            const list=document.getElementById('todo-list');
            Array.from(document.getElementById('user-todo').options).map(elem => {
                //console.log(todos.userId);
                if(todos.userId==elem.id){
                    const delX=document.createElement('div');
                    delX.innerHTML='<b>X</b>';
                    delX.classList='close';
                    delX.addEventListener('click',deleteIl);
                    const elList=document.createElement('il');
                    elList.innerText=todos.title+' - '+elem.value;
                    elList.classList='todo-item';
                    elList.id=todos.id;
                    if(maxID<todos.id){maxID=todos.id; }
                    const check=document.createElement('input');
                    check.type='checkbox';
                    check.addEventListener('click', checkClick);
                    if(todos.completed==true){
                        check.checked=true; 
                    }else {check.checked=false;}
                    elList.append(delX);
                    elList.prepend(check);
                    
                    list.append(elList);
                }  
            });
        })
    })
    .catch(console.error);


function createIl(ev){

    ev.preventDefault();
    maxID++;
    const li=document.getElementById('todo-list');
    const delX=document.createElement('div');
    delX.innerHTML='<b>X</b>';
    delX.classList='close';
    delX.addEventListener('click',deleteIl);
    
    const lab=document.getElementById('new-todo');
    const sel=document.getElementById('user-todo');
    const text=lab.value + ' - ' + sel.options[sel.selectedIndex].text;
    

    const elList=document.createElement('il');
    elList.innerText=lab.value + ' - ' + sel.options[sel.selectedIndex].text;
    elList.classList='todo-item';
    elList.id=maxID;
    const check=document.createElement('input');
    check.type='checkbox';
    check.addEventListener('click', checkClick);
    check.checked=false;
    elList.append(delX);
    elList.prepend(check);
    li.prepend(elList);
   
    fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({userId: sel.options[sel.selectedIndex].id,
                            id: maxID,
                            title: lab.value,
                            completed: false,
                            })
    })
    .then(response =>{
        if(response.ok){return response.json() }
        else{
        throw new Error('failed to fetch');}
    })
    .then(console.log)
    

}

function deleteIl(){
    const parID= this.parentElement.id;
    const newURL='https://jsonplaceholder.typicode.com/todos/'+parID;
    const par=this.parentElement;
    fetch(newURL,{
        method: 'DELETE'
    })
    .then(response =>{
        if(response.ok){return response.json() }
        else{
        throw new Error('failed to fetch');}
    })
    .then(console.log)
    .catch(console.error);
    par.remove();
}

function checkClick(event){
    const elId= this.parentElement.id;
    const newURL='https://jsonplaceholder.typicode.com/todos/'+elId;
    fetch(newURL,{
        method: 'PATCH',
        body: JSON.stringify({completed: this.checked}),
    })
    .then(response =>{
        if(response.ok){return response.json() }
        else{
        throw new Error('failed to fetch');}
    })
    .then(console.log)
    .catch(console.error);   
}


    
    //ПРОБЛЕМА:   При загрузки страницы сами ToDo иногда не загружаются но пользователи всегда есть и проблема не в чекбоксах как решить при первой загрузки пока непонятно
    //            Попытка раскидать оба fetch по разным функциям проблему не решила возможно стоит попытаться после первой загрузки сохранять всё в память и при обновлении загружать, но выглядит как костыль и не решит проблему при первой загрузке
    //ОБНОВЛЕНИЕ: Проблема скорее всего в этой строке Array.from(document.getElementById('user-todo').options).map(elem => {...  
