import { useEffect } from 'react';
import { ReactElement, useState } from 'react';
import './App.css';

interface Rules {
  min: number | null,
  max: number | null,
  included: number | null
  excluded: number | null
}

interface Step {
  value: number,
  question: ReactElement,
  handlerYes: (val: any) => void,
  handlerNo: (val: any) => void,
}

const alphabet: Array<string> = "abcdefghijklmnopqrstuvwxyz".split("")

function App() {
  const [step, setStep] = useState(0)
  const [username, setUsername] = useState("")
  const [rules, setRules] = useState({
    min: null,
    max: null,
    included: null,
    excluded: null
  } as Rules)
  
  function calcUsername() {
    const length = Math.floor(Math.random() * ((rules.max ?? 20) - (rules.min ?? 0))) + (rules.min ?? 0)
    const result = []
    for (let i = 0; i < length; i++) {
      let rand = -1
      while (rand === -1 || rand === rules.excluded){
        rand = Math.floor(Math.random() * alphabet.length)
      }
      result.push(alphabet[rand])
    }
    if (rules.included && !result.includes(alphabet[rules.included])){
      result.pop()
      result.push(alphabet[rules.included])
    }
    setUsername(result.join(""))
  }

  function handleYes (): any {
    steps[step].handlerYes(steps[step].value)
    setStep(step + 1)
  }
  function handleIdk(): any {
    setStep(step + 1)
  }
  function handleNo (): any {
    steps[step].handlerNo(steps[step].value)
    setStep(step + 1)
  }

  useEffect(() => {
    if (step === 3 && !username) {
      calcUsername()
    }
  })

  const [steps, setSteps] = useState([
    {
      value: Math.floor(Math.random() * 16) + 4,
      get question() {
        return <p>Does your username contain more than {this.value} characters?</p>
      },
      handlerYes(val: number) {
        setRules((rules: Rules) => {
          rules.min = val
          return rules
        })
        setSteps((steps: Array<Step>) => {
          steps[1].value = Math.floor(Math.random() * (20 - val)) + val
          return steps
        })
      },
      handlerNo(val: number): void {
        setRules((rules: Rules) => {
          rules.max = val
          return rules
        })
        setSteps((steps: Array<Step>) => {
          steps[1].value = Math.floor(Math.random() * (val))
          return steps
        })
      }
    },
    {
      value: 0,
      get question() {
        return <p>Does your username contain less than {this.value} characters?</p>
      },
      handlerYes(val: number): void {
        setRules((rules: Rules) => {
          rules.max = val
          return rules
        })
      },
      handlerNo(val: number): void {
        setRules((rules: Rules) => {
          rules.min = val
          return rules
        })
      }
    },
    {
      value: Math.floor(Math.random() * 26),
      get question() {
        return <p>Does your username contain the <em>{alphabet[this.value]}</em> character?</p>
      },
      handlerYes(val: number): void {
        setRules((rules: Rules) => {
          rules.included = val
          return rules
        })
      },
      handlerNo(val: number): void {
        setRules((rules: Rules) => {
          rules.excluded = val
          return rules
        })
      }
    },
  ]);

  return (
    <div className="App bg-gray-50 p-10 lg:p-20 h-screen">
      <div className="container m-auto flex flex-col lg:flex-row">
          <div className="rounded-lg p-6 w-full bg-gray-200 mb-5 lg:mb-0">
            { step < steps.length ?
                <div>
                  <h3 className="font-bold text-md">Guessing your username ({step + 1}/{steps.length})</h3>
                  {steps[step].question}
                  <div className="flex flex-col">
                    <button onClick={handleYes} className="rounded-md w-full my-2 p-2 bg-green-700 text-white">Yes</button>
                    <button onClick={handleIdk} className="rounded-md w-full my-2 p-2 bg-yellow-600 text-white">I don't know</button>
                    <button onClick={handleNo} className="rounded-md w-full my-2 p-2 bg-red-700 text-white">No</button>
                  </div>
                </div> :
                <div>
                  <h3 className="font-bold text-md">Your username is...</h3>
                  <p className="font-semibold text-xl">{username}</p>
                  <p>Is it right?</p>
                  <button className="rounded-md w-full my-2 p-2 bg-green-700 text-white">Yes</button>
                  <button onClick={() => window.location.href = ""} className="rounded-md w-full my-2 p-2 bg-red-700 text-white">No</button>
                </div>
            }
          </div>
          <div className="rounded-lg p-6 w-full bg-gray-200 lg:ml-3">
            <h3 className="font-bold text-md">Log in</h3>
            <form id="fakeForm">
              <label className="text-semibold block text-left" htmlFor="username">Username</label>
              <input className="w-full rounded-lg bg-gray-50 p-1 mb-2" id="username" type="text" value={username} readOnly={true}></input>
              <label className="text-semibold block text-left" htmlFor="password">Password</label>
              <input className="w-full rounded-lg bg-gray-50 p-1 mb-6" id="password" type="password"></input>
              <button className="rounded rounded-lg bg-blue-400 text-white w-full p-2">Log in</button>
            </form>
          </div>
        </div>
    </div>
  );
}

export default App;
