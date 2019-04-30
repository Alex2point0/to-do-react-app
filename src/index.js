import React from 'react';
import ReactDOM from 'react-dom';
import storageAvailable from 'storage-available'
import './index.css';

//Checking if we have tasks assigned on the browser's local storage
function checkTasks ( ) {

  let tasksArray = JSON.parse ( window.localStorage.getItem ( 'tasks' ) );
  return ( tasksArray !== null ? tasksArray : false );

};

//Main app class
class TaskApp extends React.Component {

  constructor ( props ) {

    super ( props );

    //Setting the state for the input and tasks array
    this.state = {
      value: '', //Tracking the input value
      tasksList: checkTasks ( ) //Tracking the list of tasks
    };

    //Binding necessary methods
    this.handleChange = this.handleChange.bind ( this );
    this.handleSubmit = this.handleSubmit.bind ( this );

  }

  //Handling the user's input
  handleChange ( event ) {

    this.setState ( { value: event.target.value } );

  };

  //Handling the user's submit
  handleSubmit ( event ) {

    //Preventing form submit
    event.preventDefault ( );
    
    //Checking for the browser's Local Storage for tasks
    this.hasTasks = false;
    this.tasks = JSON.parse ( window.localStorage.getItem ( 'tasks' ) );
    this.tasks === null ? this.tasks = [ ] : this.hasTasks = true;
    
    if ( this.state.value.length >= 1 ) {

      //Inserting new task to the list
      let newTask = { task: this.state.value, status: 'Uncompleted' };
      this.tasks.push ( newTask );
      window.localStorage.setItem ( 'tasks', JSON.stringify ( this.tasks ) );

    } else {

      //User tried to submit without typing
      alert('Please type a task on the text field.');

    }
    
    //Defining the newer states
    this.setState ( {
      tasksList: checkTasks ( ),
      value: '' //This is necessary for clearing the text input after submitting a task
    } );

  };

  //Handling the toggle task completed / uncompleted
  handleClick ( num ) {

    let tasksArray = this.state.tasksList;
    if ( tasksArray[ num ].status === 'Uncompleted' ) {

      //Toggling the array
      tasksArray[ num ].status = 'Completed';
      
      //Cleaning browser's local storage and inserting the updated array
      window.localStorage.clear ( );
      window.localStorage.setItem ( 'tasks', JSON.stringify ( tasksArray ) );
      
      //Reading the new tasks array and setting new state
      this.setState( { taskList: checkTasks ( ) } );

    } else {

      //Toggling the array
      tasksArray[ num ].status = 'Uncompleted';

      //Cleaning browser's local storage and inserting the updated array
      window.localStorage.clear ( );
      window.localStorage.setItem ( 'tasks', JSON.stringify ( tasksArray ) );
      
      //Reading the new tasks array and setting new state
      this.setState( { taskList: checkTasks ( ) } );

    }

  }

  //Handling the task delete buttons
  deleteTask ( num ) {

    let tasksArray = checkTasks ( );
    tasksArray.splice ( num, 1 ); //Removing the deleted task
    window.localStorage.clear ( ); //Cleaning browser's local storage
    if ( tasksArray.length < 1 ) {

      //No tasks left, clear the browser's local storage and resetting the array
      window.localStorage.clear ( );
      tasksArray = checkTasks ( );

    } else {

      //Tasks left, insert the array on browser's local storage and resetting the array
      window.localStorage.setItem ( 'tasks', JSON.stringify ( tasksArray ) );
      tasksArray = checkTasks ( );

    }
    //Setting the newer state without the deleted task
    this.setState ( { tasksList: checkTasks ( ) } );

  };
  
  render ( ) {

    //Render the tasks only if we have tasks assigned already
    let renderingTitle, renderingTasks;
    if ( checkTasks( ) !== false ) {

      //Have tasks to render
      renderingTitle = <h1 className = "title"> These are your tasks </h1>;
      renderingTasks =
        <div className = "tasks-wrapper">
          <ul>
            { checkTasks( ).map ( ( item, index ) => (
              <li key = { index+1 } >
                <span className = "list-wrapper">

                  <span className = "icons-wrapper">

                    <span className = "task-status" onClick = { ( ) => this.handleClick ( index ) } >
                      {

                        //This block only changes the completed / uncompleted images
                        item.status === 'Uncompleted'
                        ?
                          <img title = "Set task to completed" alt = "To Do Icon" src = 'to-do-icon.png' />
                        : 
                        <img title = "Set task to uncompleted" alt = "Done Icon" src = 'done-icon.png' />

                      }
                    </span>

                    <span className = "delete-task" onClick = { ( ) => this.deleteTask ( index ) } >
                      <img title = "Delete task" alt = "Delete Icon" src = 'delete-icon.png' />
                    </span>

                  </span>

                  <span className = "task-description">
                    { item.task }
                  </span>
                  
                </span>

              </li>
            ) ) }
          </ul>
        </div>
      ;

    } else {

      //No tasks to render
      renderingTitle = <h1 className = "title"> You have no tasks. Create your first task! </h1>;

    }

    //Final render. It takes the variable created with renders from above to complete the full rendering
    return (
      <div className = "wrapper">
        { renderingTitle }
        { renderingTasks }
        <div className = "form-wrapper">
          <form onSubmit = { this.handleSubmit } >
            <input type = "text" name = "task" placeholder = "ADD A NEW TASK" value = { this.state.value } onChange = { this.handleChange } />
            <input type = "submit" value = "Add Task" />
          </form>
        </div>
      </div>
    );

  };

};

//Checking if Local Storage is available to render the app
if ( storageAvailable ( 'localStorage' ) ) {

  //Available, render the app
  ReactDOM.render (
    <TaskApp />,
    document.getElementById ( 'root' )
  );

} else {

  //No local storage on the browser, send user to Google Chrome
  ReactDOM.render (
    <h1>
      This app needs the browser's Local Storage in order to work. Please, install
      <a href = "https://www.google.com/chrome" target = "_blank" rel = "noopener noreferrer"> Google Chrome </a>
      to use this app.
    </h1>,
    document.getElementById ( 'root' )
  );

}