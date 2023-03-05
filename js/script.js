

// Define a function to render an hour block with the given time
function renderHour(time) {
    // Select the container element where the hour block will be added
    const container = document.querySelector(".calendar-container");

    // Create a new div element to represent the hour block
    const hourBlock = document.createElement("div");
    hourBlock.classList.add("hour-block");

    // Create an h2 element to represent the hour number and add it to the hour block
    const h2 = document.createElement("h2");
    h2.classList.add("hour-block__number");
    h2.textContent = `${time}:00`;
    hourBlock.appendChild(h2);

    // If the time is less than or equal to 17 (5:00 PM), add the hour block to the container and return
    if (time <= 17) {
        container.appendChild(hourBlock);
        return;
    }

    // If the time is greater than 17, create an h3 element to represent the half hour mark (i.e., 5:30 PM) and add it to the hour block
    const h3 = document.createElement("h3");
    h3.classList.add("hour-block__number", "smaller-text");
    h3.textContent = `${time}:30`;
    hourBlock.appendChild(h3);

    // If the time is greater than 17, add the hour block to a document fragment to be appended later
    this.fragment.appendChild(hourBlock);
}

// Define a function to render all the hour blocks from 8:00 AM to 5:30 PM
function renderAll() {
    // Create a new document fragment to hold all the hour blocks
    const fragment = document.createDocumentFragment();

    // Iterate over each hour from 8 to 17 (i.e., 8:00 AM to 5:00 PM) and call the renderHour function to create the hour block
    for (let i = 8; i <= 17; i++) {
        renderHour(i);
    }

    // Append all the hour blocks in the document fragment to the container element
    document.querySelector(".calendar-container").appendChild(fragment);
}

// Call the renderAll function to render the timeline from 8:00 AM to 17:0 PM and assign it to a constant variable
const renderAllTime = renderAll();  // Render timeline from 8 to 17


//this code creates a new class for representing activities on a timeline. The constructor method takes an argument called 
//item that contains information about the activity's start time and duration. 
class Act {
    static id = 0;
    constructor(item) {
        const { start, duration } = item;
        Object.assign(this, item, {
            width: 200,
            end: start + duration,
            leftX: 40,
            id: Act.id++,
            startHours: Math.floor(start / 60) + 8
        });
    }
}





//In summary, this code defines a class for managing a list of activities on a timeline. The ListOfActions constructor 
// takes an array of item objects and converts them to Act instances. The calculateWidthAndLeft method compares each item 
// to every other item with a later start time to determine their position and size on the timeline. If two items overlap,
//  their width and left position are adjusted so that they don't overlap.

class ListOfActions {
    constructor(list) {
        this.items = list.sort((a, b) => a.start - b.start)
            .map(item => new Act(item));

        this.calculateWidthAndLeft();
    }

    calculateWidthAndLeft() {
        this.items.forEach((item, index) => {
            this.items.slice(index + 1).forEach(other => {
                if (item.end > other.start && item.start < other.end) {
                    item.width = 100;
                    other.width = 100;
                    if (item.leftX === other.leftX) {
                        other.leftX += 100;
                    } else if (item.leftX === 140 && other.leftX == 40) {
                        other.leftX += 200;
                    }
                }
            });
        });
    }

}


class RenderActions {
    #toDoList = null;
    #renderHours = null;

    constructor(listOfActs, renderHours) {
        this.container = document.querySelector(".calendar-container");
        this.#toDoList = listOfActs.items;
        this.#renderHours = renderHours;
        this.renderToDoList(this.#toDoList);
    }

    // Renders a single event block
    renderOneAct(act) {
        // Create a div to hold the event block
        const actContainer = document.createElement("div");
        actContainer.className = "event-block";

        // Add the event title to the container
        const title = document.createElement("p");
        title.textContent = act.title;
        actContainer.appendChild(title);

        // Set the height, width, and position of the event block
        actContainer.setAttribute(
            "style",
            `height: ${act.duration * 2}px; 
             width: ${act.width}px; 
             top: ${act.start * 2}px; 
             left: ${act.leftX}px; 
             background: #E2ECF580; 
             border-left: 3px solid #6e9fcf80;`
        );

        return actContainer;
    }

    // Renders the entire to-do list
    renderToDoList(list) {
        // Clear the container before rendering the list
        this.container.innerHTML = '';

        // Render the hours
        renderAll();

        // Render each event block and add it to the container
        list.forEach(item => {
            const actContainer = this.renderOneAct(item);
            this.container.appendChild(actContainer);
        });

        // Render the modal options
        this.modalWindowOptions();
    }


    // remove and change events method and change colors

    modalWindowOptions() {
        let listOfBlocks = this.container.querySelectorAll(".event-block");

        let arrFromNode = Array.from(listOfBlocks);
        listOfBlocks.forEach(item => {
            let titleText = item.querySelector('p');

            // calculating time from pixels
            let startInPixels = item.style.top.replace('px', '');           // remove "px" from the string
            let startHours = (+startInPixels / 2 - ((+startInPixels / 2) % 60)) / 60 + 8 + "";  // calculate hours as multiple of 2 pixels (half an hour)
            let startMinutes = (+startInPixels / 2) % 60 + "";  // calculate minutes as remainder of pixels 
            let duration = +item.style.height.replace('px', '') / 2; // remove "px" from the string


            // event for event block
            item.addEventListener("click", () => {

                const modalWindow = document.querySelector(".modal-info");
                modalWindow.classList.add('active');
                modalWindow.innerHTML = `
                    <div class="modal-info-text">
                        <div class="modal-header">
                            <h2 class="modal-title fs-5" id="exampleModalLabel">Edit event information</h1>
                                <button type="button" class="btn-close" id="btn-close-mdl" aria-label="Close"></button>
                        </div>
                        
                        <p>Event name: ${item.textContent}</p>
                        <p>Event start: ${startHours.padStart(2, "0")}:${startMinutes.padStart(2, "0")}</p>
                        <p>Duration: ${duration} minutes</p>
                    </div>    
                `;

                // change event background color (not ready yet)

                // Create a div container for the color input field
                const inputColorContainer = document.createElement("div");
                inputColorContainer.className = "input-color-container";

                // Create an input field for choosing the background color
                const actColorInput = document.createElement("input");
                actColorInput.type = 'color';

                // Create a label for the input field
                const actColorInputLabel = document.createElement("label");
                actColorInputLabel.className = "input-color-background";
                actColorInputLabel.textContent = "Event background:";
                actColorInputLabel.append(actColorInput);

                // Add the label to the container
                inputColorContainer.append(actColorInputLabel);

                // Set the default value of the color input field
                actColorInput.value = "#E2ECF5";

                // When the user selects a color, update the background of the event block
                actColorInput.addEventListener("input", () => {
                    item.style.background = `${actColorInput.value}80`; // The last two digits (80) set the opacity of the color
                });



                // Create buttons and container
                // const closeBtn = document.createElement("button");
                const closeBtn = document.querySelector("#btn-close-mdl");
                const removeBtn = document.createElement("button");
                const commitBtn = document.createElement("button");
                const containerForButtons = document.createElement("div");

                // Add buttons to container
                // containerForButtons.append(commitBtn, closeBtn, removeBtn);
                containerForButtons.append(commitBtn, removeBtn);

                // Assign properties to "Edit" button
                commitBtn.type = "button";
                commitBtn.className = "modal-info-commit-btn btn btn-primary";
                commitBtn.innerText = "Edit";

                closeBtn.addEventListener('click', (event) => {
                    // Only remove the modal if the close button was clicked
                    if (event.target === closeBtn) {
                        modalWindow.classList.remove('active');
                    }
                });

                // Assign properties to "Remove" button
                removeBtn.type = "button";
                removeBtn.className = "modal-info-remove-btn btn btn-danger";
                removeBtn.innerText = "Remove";


                removeBtn.addEventListener('click', (event) => {
                    if (event.target !== removeBtn) {
                        return;
                    }
                    modalWindow.classList.remove('active');

                    // remove item from the ToDoList array by index
                    toDoList.splice(arrFromNode.indexOf(item), 1);

                    // update the toDoList and re-render the calendar
                    this.#toDoList = new ListOfActions(toDoList);
                    this.renderToDoList(this.#toDoList.items);
                });

                // change event title, start, duration
                // create a container for input elements
                const inputChangeEventContainer = document.createElement("div");
                inputChangeEventContainer.className = "input-change-event-container";
                const inputChangeEventContainer_title = document.createElement("p");
                inputChangeEventContainer.append(inputChangeEventContainer_title);
                inputChangeEventContainer_title.innerHTML = 'Change event properties';

                // create input element for the new event title
                const actNameInput = document.createElement("input");
                actNameInput.className = "form-control";
                actNameInput.placeholder = "Event title";
                actNameInput.type = 'text';
          
                inputChangeEventContainer.append(actNameInput);

                // create input element for the new event start time
                const actStartInput = document.createElement("input");
                actStartInput.className = "form-control";
                actStartInput.type = 'time';
                inputChangeEventContainer.append(actStartInput);
            

                // create input element for the new event duration
                const actDurationInput = document.createElement("input");
                actDurationInput.type = 'number';
                actDurationInput.className = "form-control";
                actDurationInput.placeholder = "New duration:";
                inputChangeEventContainer.append(actDurationInput);
             

                // add the input elements to the modal window for changing event properties
                modalWindow.append(inputChangeEventContainer);


                commitBtn.addEventListener("click", () => {
                    const currentNodeIndex = arrFromNode.indexOf(item);
                    const currentToDoItem = toDoList[currentNodeIndex];

                    // update title
                    if (!!actNameInput.value) {
                        const newTitle = actNameInput.value;
                        titleText.textContent = newTitle;
                        currentToDoItem.title = newTitle;
                    }

                    // update start time
                    if (!!actStartInput.value) {
                        const startTime = getTimeInMinutes(actStartInput.value);
                        if (startTimeIsValid(startTime)) {
                            currentToDoItem.start = startTime;
                            updateToDoListItemPosition(item, startTime);
                        }
                    }

                    // update duration
                    if (!!actDurationInput.value) {
                        const newDuration = +actDurationInput.value;
                        currentToDoItem.duration = newDuration;
                        updateToDoListItemHeight(item, newDuration);
                    }

                    // update modal window
                    const startHours = padStartZero(Math.floor(currentToDoItem.start / 60));
                    const startMinutes = padStartZero(currentToDoItem.start % 60);
                    const duration = currentToDoItem.duration;
                    const modalWindowContent = `
                      <div class="modal-info-text">
                        <b>Event name: ${item.textContent}</b>
                        <p>Event start: ${startHours}:${startMinutes}</p>
                        <p>Duration: ${duration} minutes</p>
                      </div>
                      `;
                    modalWindow.innerHTML = modalWindowContent;

                    // re-render to-do list
                    toDoList.sort((a, b) => a.start - b.start);
                    this.#toDoList = new ListOfActions(toDoList);
                    this.renderToDoList(this.#toDoList.items);

                    // hide modal window
                    modalWindow.classList.remove('active');
                });

                // helper functions

                function padStartZero(number) {
                    return number.toString().padStart(2, "0");
                }

                function getTimeInMinutes(timeString) {
                    const hours = +timeString.slice(0, 2);
                    const minutes = +timeString.slice(3);
                    return (hours - 8) * 60 + minutes;
                }

                function startTimeIsValid(startTime) {
                    return startTime < 540 && startTime >= 0;
                }

                function updateToDoListItemPosition(item, startTime) {
                    item.style.top = `${startTime * 2}px`;
                }

                function updateToDoListItemHeight(item, newDuration) {
                    item.style.height = `${newDuration * 2}px`;
                }


                //-----------------------------------------------------------------------------------------------
                modalWindow.append(inputChangeEventContainer, containerForButtons);
                // modalWindow.append(inputChangeEventContainer, inputColorContainer, containerForButtons);
            });
        });
    }
}





// Function that returns the Inputs class
function Inputs(renderActions) {
    // Private properties of the class
    let listOfActs = null;

    // Private method to calculate start time for an event from input time
    function calculateStartTime(time) {
        const hours = time.slice(0, 2);
        let minutes = time.slice(3);
        minutes = +minutes;
        return (+hours - 8) * 60 + minutes;
    }

    // Private method to add a new event to the list of actions
    function addNewEvent() {
        const btnAddEvent = document.querySelector('.input-btn-add');
        const btnShowInputs = document.querySelector('.open-inputs-btn');
        const btnCloseInputs = document.querySelector('.input-btn-close');
        const inputContainer = document.querySelector('.inputs-container');
        const startInput = document.getElementById('start-event');
        const durationInput = document.getElementById('duration-event');
        const titleInput = document.getElementById('title-event');

        startInput.value = "08:00";

        // Event listener to show inputs
        // btnShowInputs.addEventListener('click', () => {
        //     inputContainer.classList.add('active');
        //     btnShowInputs.classList.add('active');
        // });

        // Event listener to close inputs
        // btnCloseInputs.addEventListener('click', () => {
        //     inputContainer.classList.remove('active');
        //     btnShowInputs.classList.remove('active');
        // });

        // Event listener for adding a new event
        btnAddEvent.addEventListener('click', () => {
            const startTime = calculateStartTime(startInput.value);

            // Create a new Act object
            const newAct = {
                start: startTime,
                duration: +durationInput.value,
                title: titleInput.value,
            };

            // Control time for the new event
            if (durationInput.value > 0 && startTime < 540) {
                inputContainer.classList.remove('active');
                btnShowInputs.classList.remove('active');
                toDoList.push(newAct);

                // Update the list of actions and render them
                listOfActs = new ListOfActions(toDoList);
                renderActions.renderToDoList(listOfActs.items);

                // Reset the input fields
                startInput.value = "08:00";
                durationInput.value = null;
                titleInput.value = "";
            }
        });
    }

    // Call the private method to add a new event
    addNewEvent();

    // Return an object with public properties and methods of the class
    return {
        // Public property to get the list of actions
        get listOfActs() {
            return listOfActs;
        }
    };
}






let listOfActs = new ListOfActions(toDoList);
const renderActions = new RenderActions(listOfActs, renderAllTime);
const inputs = new Inputs(renderActions);




// Code for modal from bootstrap
// const myModal = document.getElementById('myModal')
// const myInput = document.getElementById('myInput')

// myModal.addEventListener('shown.bs.modal', () => {
//   myInput.focus()
// })






