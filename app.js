let notes = getItem();

const input = document.querySelector('input')
const button = document.querySelector('button')
const noteList = document.querySelector('.notes-list')
const menu = document.querySelector('.menu')
const menuItem = document.querySelectorAll('.menu-item')

async function setItem(item) {
    try{
        const {data} = await axios.post('http://localhost:4000/notes', {text: item});
        return data
    }catch (e){
        console.log(e)
    }
}

async function getItem() {
    try{
        const {data} = await axios.get('http://localhost:4000/notes');
        return data
    }catch (err){
        console.log(err);
    }
}

async function removeItem(id) {
    try{
        const {data} = await axios.delete(`http://localhost:4000/notes/${id}`);
        return data
    }catch (err){
        alert('Something went wrong...')
    }
}

async function updateInfo(text, id){
    try{
        await axios.patch(`http://localhost:4000/notes/${id}`, {text: text}).then(({data}) => {
            console.log(data)
        })
    }catch (err) {
        console.log(err)
    }
}


function renderList () {
    noteList.innerHTML = '';
    notes.forEach((item, i) => {
        noteList.innerHTML += `
            <div id=${item.id} class="note-item" style="width: 100%;">
                <div class="note-text">${i + 1}. ${item.text}</div>
            </div>
        `
    })
    // Взаимодействие с контекстным меню
    const menu = document.querySelector('.menu')

    const bodyItem = document.querySelectorAll('.note-item')

    bodyItem.forEach((item, index) => {
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            menu.classList.remove('hidden')

            const x = e.clientX;
            const y = e.clientY;

            menu.style.left = `${x}px`
            menu.style.top = `${y}px`

            const menuDelete = document.querySelector('.menu-delete');

            async function consoleSmt() {
                const id = item.getAttribute('id');
                await removeItem(id);
                notes.splice(index, 1);
                renderList();
                menu.classList.add('hidden')

                menuDelete.removeEventListener('click', consoleSmt)
            }

            menuDelete.addEventListener('click', consoleSmt)
        })
    })







    document.body.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    })

    document.body.addEventListener('click', (e) => {

        const path = e.composedPath();

        if(path.includes(menu)) {

        }else{
            menu.classList.add('hidden')
        }
    })
}

button.addEventListener('click', async (e) => {
    e.preventDefault();
    const  textFromInput = input.value

    if(textFromInput){
        notes.text = input.value
        input.value = ''
        const listItem = await setItem(notes.text);
        if(listItem) {
            notes.push(listItem);
            renderList();
        }
    }
})

window.addEventListener('load', async (e) =>{
    e.preventDefault();
    const list = await getItem();

    if (list){
        notes = list
        renderList();
    }
})

