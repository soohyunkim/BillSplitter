import React from 'react';

var hasClass = (e, c) => {
  return (' ' + e.className + ' ').indexOf(' ' + c + ' ') > -1;
}

var calculate = (state) => {
  var num = state['name'].length;
  var p = state['food'];
  var shares = new Array(num + 1).join('0').split('').map(parseFloat);
  for (let key in p)
    if (p.hasOwnProperty(key) && p !== null) {
      var x = p[key].people;
      var base = parseFloat(p[key].price / x.length).toFixed(2);
      for (let k in x)
        if (x.hasOwnProperty(k) && x !== null)
          shares[parseInt(x[k].id) - 1] += parseFloat(base);
    }
  var val = state['name'];
  for (let i = 0; i < num; ++i)
    val[i].share = shares[i];
  return val;

}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.nameid = 1;
    this.foodid = 1;
    this.state = {
      name: [],
      food: []
    }
    this.addName = this.addName.bind(this);
    this.addFood = this.addFood.bind(this);
    this.addPrice = this.addPrice.bind(this);
    this.addPerson = this.addPerson.bind(this);

  }

  addName(e) {
    if (e.keyCode === 13) {
      var arr = { num: e.target.value, id: this.nameid, share: '0' };
      this.nameid++;
      this.setState({ name: this.state['name'].concat(arr) }, () => {
        this.setState({ name: calculate(this.state) });
      });
      e.target.value = '';
    }
  }

  addFood(e) {
    if (e.keyCode === 13) {
      var arr = { num: e.target.value, id: this.foodid, price: '0', people: [] };
      this.foodid++;
      this.setState({ food: this.state['food'].concat(arr) }, () => {
        this.setState({ name: calculate(this.state) });
      });
      e.target.value = '';
    }
  }

  addPrice(e) {
    if (e.keyCode === 13) {
      var food = e.target.getAttribute('data-foodID');
      var p = this.state['food'];

      for (let key in p)
        if (p.hasOwnProperty(key))
          if (p[key].id === parseFloat(food))
            p[key].price = e.target.value;

      this.setState({ food: p }, () => {
        this.setState({ name: calculate(this.state) });
      });
    }
  }

  addPerson(e) {
    var food = e.target.getAttribute('data-foodID');
    var person = e.target.getAttribute('data-pid');
    var p = this.state['food'];
    var foodObj = {
      name: this.state.name,
      food: []
    };
    var foodArr;
    for (let key in p) {
      if (p.hasOwnProperty(key) && p !== null) {
        if (p[key].id === parseFloat(food)) {
          if (hasClass(e.target, 'selected')) {
            e.target.className = 'nameBox';
            p[key].people.filter((col) => {
              return col.id !== person;
            });
            foodArr = { num: p[key].num, id: p[key].id, price: p[key].price, people: p[key].people };
            foodObj.food.push(foodArr);
          }
          else {
            e.target.className += ' selected';
            var arr = { num: e.target.value, id: person };
            foodArr = { num: p[key].num, id: p[key].id, price: p[key].price, people: p[key].people };
            foodArr.people.push(arr);
            foodObj.food.push(foodArr);
          }
        }
        else
          foodObj.food.push({ num: p[key].num, id: p[key].id, price: p[key].price, people: p[key].people });
      }
    }
    this.setState(foodObj, () => {
      this.setState({ name: calculate(this.state) });
    });
  }

  render() {
    return (
      <div>
        <h2> Bill Splitter </h2>
        Type in People's names, followed by an enter key.<br />
        <InputBox onkey={this.addName} /><br />
        {this.state.name.map((num, i) => <NameBox key={i} text={num} showShare={true} />)}<br />
        Type in food items to be split, followed by an enter key.<br />
        <InputBox onkey={this.addFood} data={this.state.food} /><br /><br />
        {this.state.food.map((f, i) => <Food price={this.addPrice} addPerson={this.addPerson} key={i} foodItem={f} people={this.state.name} />)}
      </div>
    );
  }
}

class InputBox extends React.Component {
  render() {
    return (
      <input type='text' className='inputBox' id={this.props.id} onKeyUp={this.props.onkey} />
    );
  }
}

class Food extends React.Component {
  render() {
    return (
      <div className='foodClass'>
        <div className='foodObject'>
          <span>ITEM {this.props.foodItem.id}: {this.props.foodItem.num}</span> costs <input className='inputBox' onKeyUp={this.props.price} placeholder='Enter Price' data-foodID={this.props.foodItem.id} />
        </div>
        Click the name of the people who will be splitting costs for this item:
        {this.props.people.map((num, i) => <NameBox add={this.props.addPerson} foodID={this.props.foodItem.id} key={i} text={num} />)}
      </div>
    );
  }
}

class NameBox extends React.Component {
  render() {
    return (
      <span className='nameBox' onClick={this.props.add} data-foodID={this.props.foodID} data-pid={this.props.text.id}>
        {this.props.text.num} {this.props.showShare ? ': $ ' + this.props.text.share : ''}
      </span>
    );
  }
}

export default App;
