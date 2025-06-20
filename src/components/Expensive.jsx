import { useState } from "react"

const Expensive = () => {
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [errors, setErrors] = useState({})

    const addExpense = () =>{
        setErrors({});
        const newErrors = {};
        if(!title.trim()){
            newErrors.title = "Title is requid"
        }
        if(!amount || parseFloat(amount) <= 0) {
            newErrors.amount = "Amount Must Be Greater Than 0"
        }
        if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        
        if(amount &&title){
            const newExpense = {
                id: Date.now(),
                title:title,
                amount:parseFloat(amount)
            };
            setExpenses([...expenses,newExpense])
            setAmount('');
            setTitle('')
        }
    }
    const deleteExponse = (idToDelete) => {
          const updateExpenses = expenses.filter(expense => expense.id !== idToDelete);
          setExpenses(updateExpenses);
       
    }

    const clearAllExpenses = () => {
        setExpenses([])
    }
    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6">ERNESTE Expensive</h1>
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-6">Add New Expensive</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="">Tittle</label>
                        <input
                         className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500':'border-gray-300'}`}
                          type="text" placeholder="Ener Expensive Title"value={title} onChange={(e) => setTitle(e.target.value)} />
                          <span className="py-2 text-red-500 text-sm">{errors.title}</span>
                    </div>
                    <div>
                        <label htmlFor="">Amount</label>
                        <input className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.amount ? 'border-red-500' : 'border-gray-300'}`} type="number" placeholder="0.00"
                        value={amount} onChange={(e) => setAmount(e.target.value)} />
                        <span className="text-red-500 text-sm py-2">{errors.amount}</span>
                    </div>
                    <button onClick={addExpense} className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add Expensive</button>

                </div>

            </div>
            <div>
                <h1>My Expensive ({expenses.length})</h1>
                {expenses.length > 0 && (
                    <button className="text-red-500 text-sm hover:text-red-700" onClick={clearAllExpenses}>ClearAll</button>
                )}
                {expenses.length === 0 ? (
                    <p>No Expenses yet. Add One Above!</p>
                ):(
                    <div className="space-y-2">
                        {expenses.map(expense => (
                        <div id={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <span className="font-medium">{expense.title}</span>
                            <span className="text-green-600 font-bold">{expense.amount.toFixed(2)} RWF</span>
                            <button onClick={() => deleteExponse(expense.id)} className="text-sm text-red-500 hover:text-red-700">Delete</button>

 
                        </div>
                        ))}

                    </div>
                )}
                {expenses.length > 0 &&(
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center font-bold-text-lg">
                            <span>Totol:</span>
                            <span className="text-blue-600">{expenses.reduce((sum, expense) => sum + expense.amount ,0 ).toFixed(2)} RWF</span>
                            

                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default Expensive