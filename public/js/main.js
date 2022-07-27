// targets all DOM elements with the 'fa-trash' class
const deleteBtn = document.querySelectorAll('.fa-trash')
// targets all <span> tags where the parent has the class of 'item'
const item = document.querySelectorAll('.item span')
// targets all <span> tags with class 'completed' where the parent has the class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed')

// create an array from the querySelectorAll results, loop through all, and add a 'click' event listener that fires the 'deleteItem' function
// uses Array.from to convert to array so that we can use the forEach to loop through each item.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// create an array from the querySelectorAll results, loop through all, and add a 'click' event listener that fires the 'markComplete' function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// create an array from the querySelectorAll results, loop through all, and add a 'click' event listener that fires the 'markUnComplete' function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// selects the text in the to be deleted item (with which the deletebtn was clicked), and sends a request to the server 'deleteItem' endpoint to delete that item
// sets the headers to inform the server that it is sending json content, and the itemText variable contents in the body
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        // waiting response, parsing json
        const data = await response.json()
        console.log(data)
        // reload the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}


async function markComplete(){
    // traverses the DOM up to the parent (li) and gets the text inside of the first <span> element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sends a PUT request to the 'markComplete' endpoint, sets the headrs to inform server that it is sending json content, and the itemText variable contents in the body
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        // wait for response, parse json
        const data = await response.json()
        console.log(data)
        // reload the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sends a PUT request to the 'markUnComplete' endpoint, sets the headrs to inform server that it is sending json content, and the itemText variable contents in the body
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        // wait for response, parse json
        const data = await response.json()
        console.log(data)
        // reload the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}