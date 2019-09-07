import React from 'react';

function Navigation(props) {
  return (<div className="todo__footer">
            <span className="todo__count">{props.countActive}</span>
            <div className="todo__view-wrapper">
            <button className={props.view === 'all' ? 'todo__footer-view active' : 'todo__footer-view'} onClick={() => props.setView('all')}>Все</button>
            <button className={props.view === 'active' ? 'todo__footer-view active' : 'todo__footer-view'} onClick={() => props.setView('active')}>Активные</button>
            <button className={props.view === 'complited' ? 'todo__footer-view active' : 'todo__footer-view'} onClick={() => props.setView('complited')}>Завершенные</button>
            </div>
            <button className={(props.countComplited) ? "todo__removeComplited"  : "todo__removeComplited invisible" } onClick={props.removeComplite}>Удалить<br/>завершенные</button>
          </div>);
}

function Todolist(props) {
  const list = props.list;

  return <ul className="todo__list">{list.map(function(elem) {
                return (<li key={elem.id} className={'todo__item ' + elem.status}>
                  <button className="todo__item-change" onClick={() => props.changeStatus(elem.id)} title={(elem.status === 'active') ? "Задача выполнена" : "Доработать задачу"}>&#x2705;</button>
                  {(elem.edit !== true) 
                    ? <span className="todo__item-span" onDoubleClick={() => props.changeTodo(elem.id)}>{elem.name}</span>
                    : <input className="todo__item-input focused" onBlur={(e) => props.changeTodoAgain(e, elem.id)} onKeyPress={(e) => props.hanglerKeyPress(e, elem.id)} onChange={(e) => props.changeInput(e, elem.id)} value={elem.name} tabIndex={1} /> }
                  <button className="todo__item-close" onClick={() => props.removeTodo(elem.id)} title="Удалить задачу">&times;</button>
                  </li>);
              })}</ul>;
}

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.id = 0;
    this.state = {
      todolist: [],
      view: 'all',
    }
  }

  /*** for Todo list ***/
  filterList = () => {
    let view = this.state.view;
    if(view === 'all') return this.state.todolist;

    let list = this.state.todolist.filter(function(item) {
      return item.status === view;
    });

    return list;
  }

  getCountComplited = () => {
    let list = this.state.todolist.filter(function(item) {
      return item.status === 'complited';
    });

    return list.length;
  }

  compliteAll = (countActive, countComplited) => {
    if( countActive === 0 && countComplited !== 0) {
      let newTodoList = this.state.todolist.concat();

      newTodoList = newTodoList.map((item) => {
        item.status = 'active';
        return item;
      })

      this.setState({ todolist: newTodoList });
    } else {
      let newTodoList = this.state.todolist.concat();

      newTodoList = newTodoList.map((item) => {
        item.status = 'complited';
        return item;
      })

      this.setState({ todolist: newTodoList });
    }
  }

  handlerOnBlur = (e, id) => {
    let newTodoList = this.state.todolist.slice();
    let index = newTodoList.findIndex(item => item.id === id);

    if(e.target.value === '') {
      newTodoList.splice(index, 1);
      this.setState( {todolist: newTodoList} );
      return;
    }

    delete newTodoList[index].edit;
    this.setState( {todolist: newTodoList} );
  }

  hanglerKeyPress = (e, id) => {
    if (e.charCode !== 13) return;

    let newTodoList = this.state.todolist.slice();
    let index = newTodoList.findIndex(item => item.id === id);

    if(e.target.value === '') {
      newTodoList.splice(index, 1);
      this.setState( {todolist: newTodoList} );
      return;
    }

    delete newTodoList[index].edit;
    this.setState( {todolist: newTodoList} );
  }

  handlerOnChange = (e, id) => {
    let newTodoList = this.state.todolist.slice();

    let index = newTodoList.findIndex(item => item.id === id);

    newTodoList[index].name = e.target.value;

    this.setState( {todolist: newTodoList} );
  }

  handlerDbClick = (id) => {
    let newTodoList = this.state.todolist.slice();

    let index = newTodoList.findIndex(item => item.id === id);

    newTodoList[index].edit = true;

    this.setState( {todolist: newTodoList} );
  }

  handlerSubmit = (e) => {
    e.preventDefault();
    if(e.target.newtodo.value === '') return;

    let newTodoList = this.state.todolist.concat();
    let id = this.id++;
    newTodoList.push({ id, name: e.target.newtodo.value, status: 'active' });
    e.target.newtodo.value = '';

    this.setState({ todolist: newTodoList });
  }

  changeStatus = (id) => {
    let newTodoList = this.state.todolist.concat();

    let index = newTodoList.findIndex(item => item.id === id);

    let status = newTodoList[index].status;
    status === 'active' 
      ? newTodoList[index].status = 'complited' 
      : newTodoList[index].status = 'active'; 

    this.setState( {todolist: newTodoList} );
  }

  removeTodo = (id) => {
    let newTodoList = this.state.todolist.concat();

    let index = newTodoList.findIndex(item => item.id === id);

    newTodoList.splice(index, 1);

    this.setState( {todolist: newTodoList} );
  }
  /*** for Todo list END***/

  /*** for Navigation ***/
  setView = (view) => {
    this.setState({view});
  }

  removeComplite = () => {
    let newTodoList = this.state.todolist.concat();

    newTodoList = newTodoList.filter(function(item) {
      return item.status === 'active';
    })

    this.setState( {todolist: newTodoList} );
  }

  /*** for Navigation END***/

  componentDidUpdate = () => {
    let focused = document.getElementsByClassName('focused')[0];
    if(focused !== undefined) {
      focused.focus();
    }
  }

  componentDidMount = () => {
    document.getElementsByClassName('todo__input')[0].focus();
  }

  setEndingWord = (count) => {
    if(count === 0) return "Задач нет";
    else if( count % 10 === 0 ) return `Еще ${count} задач`;
    else if( count % 10 === 1 && count !== 11 ) return `Еще ${count} задача`;
    else if( count % 10 < 5 && !(count > 9 && count < 15) ) return `Еще ${count} задачи`;
    else return `Еще ${count} задач`;
  }

  render() {
    let filterList = this.filterList();
    let countComplited = this.getCountComplited();
    let countActive = this.state.todolist.length - countComplited;
    let className = (countActive === 0 && countComplited !== 0) ? 'todo__compliteAll active' : 'todo__compliteAll';
    let title = (countActive === 0 && countComplited !== 0) ? 'Доработать все задачи' : 'Выполнить все задачи';

      return (
        <React.Fragment>
          <h1 className="todo__header">Ваши задачи</h1>
          <form className="todo__form" onSubmit={this.handlerSubmit}>
            {(countActive !== 0 || countComplited !== 0 ) ? <button className={className} title={title} type="button" onClick={() => this.compliteAll(countActive, countComplited)}>&#x25BC;</button> : false}
            <input className="todo__input" name="newtodo" type="text" placeholder="Что вам нужно сделать?" />
            <input className="todo__submit" type="submit" value="Добавить" title="Добавить новую задачу"/>
          </form>
          {(filterList.length) ? <Todolist list={filterList} removeTodo={this.removeTodo} changeStatus={this.changeStatus} hanglerKeyPress={this.hanglerKeyPress} changeTodo={this.handlerDbClick} changeTodoAgain={this.handlerOnBlur} changeInput={this.handlerOnChange} /> : false}
          {(this.state.todolist.length) ? <Navigation countActive={this.setEndingWord(countActive)} countComplited={countComplited} setView={this.setView} removeComplite={this.removeComplite} view={this.state.view} /> : false}
          <footer className="todo__info">
            Двойной клик - редактировать задачу<br/>
            Разработал <a href="https://github.com/vova-iz-cheb" title="github">vova-iz-cheb</a>
          </footer>
        </React.Fragment>);
  }
}

export default Todo;