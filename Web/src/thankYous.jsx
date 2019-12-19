import React from 'react';

import './thankYous.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class ThankYous extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      thankYous: null,
      mailerFields: ['firstName', 'lastName', 'address1', 'address2', 'city', 'state', 'zip', 'type', 'amount'],
      edittedFields: [],
      csv: null, //output variable
    };

    this.$csvRef = React.createRef();
    this.onChangeThankYou = this.onChangeThankYou.bind(this);
    this.onClickAdd = this.onClickAdd.bind(this);
    this.onClickOutputToCSV = this.onClickOutputToCSV.bind(this);
    this.onClickCopyCSVToClipboard = this.onClickCopyCSVToClipboard.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
  }

  componentDidMount() {
    this.loadThankYous();
  }

  onChangeThankYou(e) {
    let id = e.currentTarget.id;

    let { edittedFields } = this.state;
    edittedFields[id] = e.currentTarget.value;

    this.setState({ edittedFields });
  }

  onClickAdd(e) {
    let { thankYous, edittedFields } = this.state;

    thankYous.push({
      'firstName': edittedFields['firstName'],
      'lastName': edittedFields['lastName'],
      'address1': edittedFields['address1'],
      'address2': edittedFields['address2'],
      'city': edittedFields['city'],
      'state': edittedFields['state'],
      'zip': edittedFields['zip'],
      'type': edittedFields['type'],
      'amount': edittedFields['amount']
    });

    this.setState({ thankYous, edittedFields: [] });
  }

  onClickCopyCSVToClipboard(e) {
    this.copyCSVToClipboard();

    //clear after copy
    this.setState({ csv: null });
  }

  onClickOutputToCSV() {
    let csv = '';

    for (const thankYou of this.state.thankYous) {
      {
        Object.keys(thankYou).map(field => {

          csv += (thankYou[field] ? thankYou[field] : '');

          if (field == 'firstName') {
            csv += ' ';
          } else {
            csv += ';';
          }
        })
      }
      csv += '\n';
    }
    this.setState({ csv });
    console.log(csv);
  }

  onClickSave(e) {
    fetch("http://localhost:3001/save", {
      method: 'POST',
      body: JSON.stringify(this.state.thankYous),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      return response.json();
    });
  }

  loadThankYous() {
    fetch("http://localhost:3001/load")
      .then(response => response.json())
      .then(data => {
        console.log(JSON.parse(data));
        this.setState({ thankYous: JSON.parse(data) })
      });
  }

  copyCSVToClipboard() {
    var textField = document.createElement('textarea')
    textField.innerText = this.state.csv;
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  toUpperCase(field) {
    return field.charAt(0).toUpperCase() + field.slice(1);
  }

  renderField(field) {
    let uppercaseField = this.toUpperCase(field);
    return <div key={field} className="row col align-items-center m-2">
      <label htmlFor={field} className="col-3">{uppercaseField}:</label>
      <input id={field} className="col-7 m-2" onChange={this.onChangeThankYou} value={this.state.edittedFields[field] || ''} placeholder={"Insert " + uppercaseField} />
    </div>;
  }

  render() {
    return (
      <div className="container col-xl-11 mt-5">
        <div className="row">
          <div className="col-4 align-items-center text-left">
            {
              this.state.csv && <div className="text-center">
                {this.state.csv.split("\n").map(function (item, idx) {
                  return (
                    <span key={idx}>
                      {item}
                      <br />
                    </span>
                  )
                })}
              </div>
            }

            <div className="col text-right">
              {this.state.mailerFields != null && this.state.mailerFields.map(field => (this.renderField(field)))}
            </div>
          </div>

          <div className="col-8 card border-primary p-0">
            <div className="card-header text-left">
              <h3><b>Thank Yous</b></h3>
            </div>
            <div className="card-body">
              <div className="col row text-left">
                {this.state.mailerFields != null && this.state.mailerFields.map(field => (
                  <div key={field} className="col p-0"><b>{this.toUpperCase(field)}</b></div>
                ))}
              </div>

              <div className="col text-left">{
                this.state.thankYous != null && this.state.thankYous.map((thanks, index) => (
                  <div key={index} className="row">
                    {Object.keys(thanks).map(field => (
                      <div key={field} className="col p-0">{thanks[field]}</div>
                    ))}
                  </div>
                ))
              }
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 text-center">
          <button className="btn btn-small btn-success m-2" onClick={this.onClickAdd}>Add Thanks</button>
          <button className="btn btn-small btn-primary m-2" onClick={this.onClickSave}>Save</button>
          <button className="btn btn-small btn-info m-2" onClick={this.onClickOutputToCSV}>Output to CSV</button>
          <button className="btn btn-small btn-info m-2" onClick={this.onClickCopyCSVToClipboard}>Copy to Clipboard</button>
        </div>
      </div >
    );
  }
}

export default ThankYous;
