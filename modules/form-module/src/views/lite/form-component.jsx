import React, { useState, useEffect, useCallback } from 'react'
import _ from 'underscore'

const schema = {
  firstName:  { placeholder:'First Name', initial: '' },
  lastName: { placeholder:'Last Name', initial: '' },
  phoneNumber : { placeholder:'Phone Number', initial: '' },
  businessEmail : { placeholder:'Business Email', initial: '' },
  jobTitle : { placeholder:'Job Title', initial: '' },
  companyName : { placeholder:'Company Name', initial: '' },
  useCase : { placeholder:'Use Case', initial: '' }
}

 /*const styles = {
   textInput: {
     border: '1px solid #eee',
     padding: '2px 4px',
     outline: 'none',
     borderRadius: '6px',
     background: '#fff'
   }
 }*/

export const FormComponent = (props) => {
  const [state, setState] = useState({})
  const [submittted, setSubmitted] = useState(false)

  useEffect(() => {
    const formFields = _.pick(props, Object.keys(schema))
    setState({...state, ...formFields})
  }, [props])

  const handleChange = useCallback((key, evt) => {
    setState({...state, [key]: evt.target.value })
  }, [state])

  const handleSubmit = useCallback(evt => {
    evt.preventDefault()
    props.onSendData({ type: 'form-data', data: state })
    props.onSendData({ type: 'text', text: 'Looks good!' })
    setSubmitted(true)
  }, [props, state])

  return (
    <div>
      {!submittted && (
        <form onSubmit={handleSubmit}>
        {Object.entries(state).map(([key, value]) => (
          <input value={value} key={key} placeholder={schema[key].placeholder || ''} onChange={evt => handleChange(key, evt)} />
        ))}
        <input type="submit" value="Submit"/>
      </form>
      )}
    {submittted && (<div><h1>Submitted!</h1></div>)}
  </div>
  );}

/*class FormComponent2 extends React.Component {
  constructor(props) {
    super(props)
    
  }
  // constructor (props) {
  //   super(props)

  //   const formStartingState = {}
    
  //   for (let key of schema) {
  //     formStartingState[key] = props[key] || ''
  //   }
    
  //   this.state = {
  //     ...formStartingState
  //   }
  // }

  // handleInputChange = (fieldName, value) => {
  //   this.setState({ ...this.state, fieldName: value })
  // }

  render() {
    
    return (
      <div>
        <h1>Form</h1>
        <div>{this.props}</div>
         <form>
        {Object.keys(schema).map((fieldName) => (
          <input
            value={this.state[fieldName]}
            placeholder={schema[fieldName].placeholder}
            onChange={(evt) =>
              this.handleInputChange(fieldName, evt.target.value)
            }
          />
        ))}
          </form> 
      </div>
    )
  }
}
*/
/*function handleChange(event) {
  const value = event.target.value;
  setState({...this.props, [event.target.name]: value});
}*/


        /* <input placeholder="First Name" id="fn" value={this.props.firstName} onChange={(event) => {}}/>
        <input placeholder="Last Name" id="ln" value={this.props.lastName} />
        <input placeholder="Phone Number" id="pn" value={this.props.phoneNumber} />
        <input placeholder="Business Email" id="be" value={this.props.businessEmail} />
        <input placeholder="Job Title" id="jt" value={this.props.jobTitle} />
        <input placeholder="Company" id="co" value={this.props.companyName} />
        <input placeholder="Use Case" id="uc" value={this.props.useCase} />
        <button>Submit!</button> */