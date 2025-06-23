import { useEffect, useState } from "react"

const Expensive = () => {
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [errors, setErrors] = useState({});
    const [category, setCategory] = useState("food");
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(true)

    const categories = ['food','transport','Enteetainment','shopping','bills','other'];

    useEffect(()=> {
        const loadExpenses = () => {
            try {
                const savedExpenses = localStorage.getItem('expenses');
                if(savedExpenses){
                    const parsedExpense = JSON.parse(savedExpenses)
                    setExpenses(parsedExpense)
                }
                
            } catch (error) {
                console.error('error loading expense',error);
                setExpenses([])
                
            }finally{
                setTimeout(() => setIsLoading(false), 500)
            }
          
        }
        loadExpenses()

    },[])

    useEffect(() => {
        if(!isLoading){
            try {
                localStorage.setItem('expenses',JSON.stringify(expenses))
                
            } catch (error) {
                console.log('error saving expenses',error);
                
            }
        }
    },[expenses, isLoading])

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

        if(editingId){
            const updatedExpenses = expenses.map(expense => expense.id === editingId ? {id:editingId, title:title.trim(), amount:parseFloat(amount),category} : expense)

        setExpenses(updatedExpenses);
        setEditingId(null);

        } else{

            if(amount &&title){
                const newExpense = {
                    id: Date.now(),
                    title:title,
                    amount:parseFloat(amount),
                    category:category
                };
                setExpenses([...expenses,newExpense])
                setAmount('');
                setTitle('')
                setCategory('food')
            }

        }

      
    }
    const deleteExponse = (idToDelete) => {
        if(window.confirm('are you sure you want to delete this expense')){
            const updateExpenses = expenses.filter(expense => expense.id !== idToDelete);
          setExpenses(updateExpenses);

        }
          

          if(editingId === idToDelete){
            setEditingId(null);
            setTitle('');
            setAmount('');
            setCategory('food');
          }
       
    }

    const startEdit = (expense) => {
        setEditingId(expense.id);
        setTitle(expense.title);
        setAmount(expense.amount.toString());
        setCategory(expense.category);
        setErrors({});
    }

    const concelEdit = () => {
        setEditingId('');
        setTitle('');
        setAmount('');
        setCategory('food');
        setErrors({});
    }

    const clearAllExpenses = () => {
        if(window.confirm('are you sure you want to delete all expenses')){
            setExpenses([])
        }
    }

    const expensesByCategory = expenses.reduce((acc, expense) => {
        if(! acc[expense.category]) {
            acc[expense.category] = [];
        }
        acc[expense.category].push(expense);
        return acc;
    },{})

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6"> 💰 ERNESTE Expensive</h1>
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-6">{editingId ? '✏️ Edit Expense': ' ➕ Add New Expense'}</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="">Tittle</label>
                        <input
                         className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500':'border-gray-300'}`}
                          type="text" placeholder="Enter Expensive Title"value={title} onChange={(e) => setTitle(e.target.value)} />
                          <span className="py-2 text-red-500 text-sm">{errors.title}</span>
                    </div>
                    <div>
                        <label htmlFor="">Amount</label>
                        <input className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.amount ? 'border-red-500' : 'border-gray-300'}`} type="number" placeholder="0.00"
                        value={amount} onChange={(e) => setAmount(e.target.value)} />
                        <span className="text-red-500 text-sm py-2">{errors.amount}</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="Category">Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} name="" id=""
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {categories.map(cat => (
                                <option key={cat} value="cat"> {cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2">

                    <button onClick={addExpense} className={`w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${editingId 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-blue-500 hover:bg-blue-600'}`}>{editingId ? 'update Expenses' : 'add Expenses'}</button>
                    </div>
                   {editingId &&(
                    <button   className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600" onClick={concelEdit}>Cancel</button>
                   )}

                </div>

            </div>
            <div>
                <h1>  📋 My Expensive ({expenses.length})</h1>
                {expenses.length > 0 && (
                    <button className="text-red-500 text-sm hover:text-red-700 text-left" onClick={clearAllExpenses}>ClearAll</button>
                )}
                {expenses.length === 0 ? (
                    <p>No Expenses yet. Add One Above! 👆</p>
                ):(
                    
                    <div className="space-y-2">
                        {/* {Object.entries((expensesByCategory).map(([categoriesName, categoryExpenses]) => { */}
                        {Object.entries(expensesByCategory).map(([categoriesName, categoryExpenses]) => {

                            <div key={categoriesName} className="border rounded-lg overflow-hidden">
                              <div className="bg-blue-50 px-4 py-2 border-b">
                                <h3 className="font-semibold text-blue-800">{categoriesName} ({categoryExpenses.length})</h3>

                              </div>
                              <div className="divide-y">
                                {categoryExpenses.map((expense ) => (
                                    <div key={expense.id} className={`flex justify-between items-center p-3 ${editingId === expense.id ? 'bg-gray-50 border border-yellow-200' : 'bg-white'}`}>
                                        <div>
                                            <span className="font-medium">{expense.title}</span>
                                            {editingId === expense.id && (
                                                <span className="ml-2 text-sm text-yellow-600">(Editing)</span>
                                            )}
                                        </div>

                                    </div>
                                ))}
                              </div>
                            </div>
                        })}
                        {expenses.map(expense => (
                        <div id={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <span className="font-medium">{expense.title}</span>
                            <span className="text-green-600 font-bold">{expense.amount.toFixed(2)} RWF</span>
                            <button onClick={() => startEdit(expense)} className="text-blue-500 hover:text-blue-700 text-sm font-medium">✏️ Edit</button>
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