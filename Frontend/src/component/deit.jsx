import { useContext, useEffect, useState } from "react";
import { authContext } from "../contexts/authContext";
import Header from "./header"
import "./css/diet.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar,faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import TypingText from "./Animation/typingText";
import { useNavigate } from "react-router-dom";

 

export default function Diet(){

    const navigate = useNavigate();

    
    let loggedData = useContext(authContext)

    
    const [items, setItems] = useState([])


    const [date, setDate] = useState(formatDate(new Date())); 

    
    let [total, setTotal] = useState({
        totalCaloreis: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0,
        totalFiber: 0
    })

    
    function formatDate(date) {
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = `0${month}`; 
        }
        let day = date.getDate();
        if (day < 10) {
            day = `0${day}`; 
        }
        return `${year}-${month}-${day}`;
    }

    
    useEffect(()=>{
        fetch(`http://localhost:8000/track/${loggedData.loggedUser.userid}/${date}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${loggedData.loggedUser.token}`
            }
        })
        .then((response)=>response.json())
        .then((data)=>{
            console.log(data);
            
            setItems(data);
        })
        .catch((err)=>{
            console.log(err);
        })
    }, [date])

   
    useEffect(()=>{
        calculateTotal();
    }, [items])

    function calculateTotal() {
        let totalCopy = {
            totalCaloreis: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFats: 0,
            totalFiber: 0
        };
    
        items.forEach((item) => {
            if (item.details) {
                totalCopy.totalCaloreis += item.details.calories || 0;
                totalCopy.totalProtein += item.details.protein || 0;
                totalCopy.totalCarbs += item.details.carbohydrates || 0;
                totalCopy.totalFats += item.details.fat || 0;
                totalCopy.totalFiber += item.details.fiber || 0;
            }
        });
    
        setTotal(totalCopy);
        
        loggedData.setLoggedUser((prevState) => {
            return { ...prevState, Total: totalCopy};
        });

        console.log(loggedData);
    }
    

   
    
    return(
        <section className="container diet-container ">
            <Header/>
            <div className="logdate">
                <div className="date-input-container">
                    <input
                        type="date"
                        className="styled-date-input"
                        value={date}
                        onChange={(event) => {
                            setDate(event.target.value);
                        }}
                    />
                    <label htmlFor="datePicker">
                        <FontAwesomeIcon className="calendar-icon" icon={faCalendar} />
                    </label>

                </div>
                
                
            </div>

            
            <div className="item cal-div">
                <div className="tol-cal">
                    <h1>Total</h1>
                    <article className="nutrient nut1">
                        <img className="cal-img" src="/symbol/calories.png" alt="Calories" />
                        <h3 className="n-value">{total.totalCaloreis} Kcal</h3>
                    </article>
                </div>
                
                <div className="nut-info">
                    <article className="nutrient">
                        <img className="nut-img1" src="/symbol/Protein.png" alt="protein" />
                        <p className="n-value">{total.totalProtein}g</p>
                    </article>

                    <article className="nutrient">
                        <img className="nut-img1" src="/symbol/carb.png" alt="carb" />
                        <p className="n-value">{total.totalCarbs}g</p>
                    </article>

                    <article className="nutrient">
                        <img className="nut-img1" src="/symbol/fat.png" alt="fat" />
                        <p className="n-value">{total.totalFats}g</p>
                    </article>

                    <article className="nutrient">
                        <img className="nut-img1" src="/symbol/Fiber.png" alt="fiber" />
                        <p className="n-value">{total.totalFiber}g</p>
                    </article>
                </div>
            </div>

            
            <h1>Food Items</h1>
            {
                items.length !== 0 ?
                items.map((item) => {
                
                    if (item && item.details) {
                        return (
                            <div className="item" key={item._id}>
                                <h3>{item.foodId.name} ( {item.details.calories} Kcal for {item.quantity}g )</h3>
                                <div className="nut-info">
                                    <article className="nt">
                                        <p className="n-title">Protein</p>
                                        <p className="n-value">{item.details.protein}g</p>
                                    </article>

                                    <article className="nt">
                                        <p className="n-title">Carbs</p>
                                        <p className="n-value">{item.details.carbohydrates}g</p>
                                    </article>

                                    <article className="nt">
                                        <p className="n-title">Fat</p>
                                        <p className="n-value">{item.details.fat}g</p>
                                    </article>

                                    <article className="nt">
                                        <p className="n-title">Fiber</p>
                                        <p className="n-value">{item.details.fiber}g</p>
                                    </article>
                                </div>
                            </div>
                        );
                    } else {
                        
                        return null;
                    }
                }) 
                :
                (
                    <div className="eat-food">
                        <img src="/addfood.png" alt=""  onClick={()=>{
                            navigate("/track")
                        }}/>
                        <span className="ad-text">
                                <TypingText text="Add food items... " />
                        </span>
                    </div>
                )
            }
        </section>
    )
}
