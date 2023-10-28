let btn = document.querySelector('#btn')
let list = document.querySelector('tbody')
let inp = document.querySelector('#inp')

function addItemsToTable(data){
  list.innerHTML = ''
  cnt = 0
  for (item of data.items) {
    cnt = cnt + 1
    list.innerHTML += `<tr>
    <th scope="row">${cnt}</th>
    <td class="listItem">${item}</td>
    <td class="actionButtons">
    <button type="button" class="btn btn-success edit" data-cnt=${cnt}>Edit</button>
    <button type="button" class="btn btn-danger delete" data-cnt=${cnt}>Delete</button>
    </tr>`
  }
}

// When add button is clicked, send item to server
btn.addEventListener('click', () => {
  data = inp.value
  fetch('/add_item', {
    method: 'POST',
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify({ item: data })
  }) 
    .then(response => response.json())
    .then(data => addItemsToTable(data))
    inp.value = ''
})

// When delete button is clicked, send item number to server
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')){
    console.log("delete")
    console.log(e.target.dataset['cnt'])
    num = e.target.dataset['cnt']
    fetch('/delete_item', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({ num: num })
  })
    .then(response => response.json())
    .then(data => addItemsToTable(data))
  }
  if (e.target.classList.contains('cancel')){
    console.log("cancel")
    fetch('/fetch_items')
  .then(response => response.json())
  .then(data => {
    addItemsToTable(data)
  })
  }
  if (e.target.classList.contains('save')){
    console.log("save")
    console.log(e.target.parentElement.parentElement.querySelector('.listItem input').value)
    fetch('/edit_item', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({ num: e.target.dataset['cnt'], item: e.target.parentElement.parentElement.querySelector('.listItem input').value})
    }) 
      .then(response => response.json())
      .then(data => { 
        addItemsToTable(data)
        console.log(data)
      })
  }
  if (e.target.classList.contains('edit')){
    console.log("edit")
    let pa = e.target.parentElement.parentElement
    let td = pa.querySelector(".listItem")
    td.innerHTML = `<input value='${td.innerHTML}'>`
    let btns = pa.querySelector('.actionButtons')
    let ed = btns.querySelector('.edit')
    ed.classList.remove('edit')
    ed.classList.add('save')
    ed.innerText = "Save"
    let dd = btns.querySelector('.delete')
    dd.classList.remove('delete')
    dd.classList.add('cancel')
    dd.innerText = "Cancel"
  }
})

// When website loads
fetch('/fetch_items')
  .then(response => response.json())
  .then(data => {
    addItemsToTable(data)
  })