import React, { Component } from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import './App.css';

class App extends Component {

    constructor(props){
        super(props);
        this.isSpanish = navigator.language.toLowerCase().startsWith("es");
        this.state = {
            seats: 1,
            votes: [0, 0],
            seatsByParty: [0, 0],
            names: [this.isSpanish ? "Partido 1" : "Party 1", this.isSpanish ? "Partido 2" : "Party 2"],
            colors: ["#FF0000", "#0000FF"]
        }
    }

    componentDidMount() {
        this.calculateSeatsByParty();
    }

    setSeats(seats) {
        this.setState({seats}, this.calculateSeatsByParty)
    }

    setParties(parties) {
        this.setState({parties}, this.calculateSeatsByParty)
    }
    
    setVotes(votes, party) {
        this.state.votes[party] = parseInt(votes);
        this.setState({}, this.calculateSeatsByParty);
    }
    
    setName(name, party) {
        this.state.names[party] = name;
        this.setState({}, this.calculateSeatsByParty);
    }

    setColor(color, party) {
        this.state.colors[party] = color;
        this.setState({}, this.calculateSeatsByParty);
    }

    addParty() {
        this.setState({
            votes: [...this.state.votes, 0],
            seatsByParty: [...this.state.seatsByParty, 0],
            names: [...this.state.names, `${this.isSpanish ? "Partido": "Party"} ${this.state.names.length + 1}`],
            colors: [...this.state.colors, `#${Math.floor(Math.random()*16777215).toString(16)}`]
        }, this.calculateSeatsByParty);
    }

    removeParty(party) {
        this.state.votes.splice(party, 1);
        this.state.seatsByParty.splice(party, 1);
        this.state.names.splice(party, 1);
        this.state.colors.splice(party, 1);
        this.setState({}, this.calculateSeatsByParty);
    }

    calculateSeatsByParty(){
        let votes2 = [...this.state.votes];
        this.state.seatsByParty = Array(this.state.seatsByParty.length).fill(0)
        for(let i = 0; i < this.state.seats; i++) {
            let seatWinner = votes2.indexOf(Math.max(...votes2));
            this.state.seatsByParty[seatWinner]++;
            votes2[seatWinner] = Math.floor(this.state.votes[seatWinner] / (this.state.seatsByParty[seatWinner] + 1));
        }
        this.setState({});
    }

    render() {
        let seatData = this.state.seatsByParty?.map((seats, i) => {
            return { name: this.state.names[i], seats }
        });
        return (
            <>
                <div className='app'>
                    <div>
                        <div className='title'>
                            <img
                                src="./d_hondt.png"
                                alt="d'Hondt tread on me"
                            />
                            <div>
                                {
                                    this.isSpanish && "Simulador de asignación de escaños usando el método d'Hondt"
                                }
                                {
                                    !this.isSpanish && "Seat allocation simulator using the d'Hondt method"
                                }
                            </div>
                            <div>
                                {
                                    this.isSpanish && 
                                    <>
                                    por
                                    </>
                                }
                                {
                                    !this.isSpanish && 
                                    <>
                                    by
                                    </>
                                } <a href="/" target="_blank">progredemente</a>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="seats">
                                {
                                    this.isSpanish && "Escaños disputados"
                                }
                                {
                                    !this.isSpanish && "Contested seats"
                                }
                            </label>
                            <br />
                            <input type="number" name="seats" value={this.state.seats} onChange={(evt) => this.setSeats(evt.target.value)}/>
                        </div>
                        <br />
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>
                                            {
                                                this.isSpanish && "Nombre del partido"
                                            }
                                            {
                                                !this.isSpanish && "Party name"
                                            }
                                        </th>
                                        <th>Color</th>
                                        <th>
                                            {
                                                this.isSpanish && "Votos"
                                            }
                                            {
                                                !this.isSpanish && "Votes"
                                            }
                                        </th>
                                        <th>
                                            {
                                                this.isSpanish && "Escaños"
                                            }
                                            {
                                                !this.isSpanish && "Seats"
                                            }
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <input type="text" value={this.state.names[0]} onChange={(evt) => this.setName(evt.target.value, 0)} />
                                        </td>
                                        <td>
                                            <input type="color" value={this.state.colors[0]} onChange={(evt) => this.setColor(evt.target.value, 0)} />
                                        </td>
                                        <td>
                                            <input type="number" value={this.state.votes[0]} onChange={(evt) => this.setVotes(evt.target.value, 0)} />
                                        </td>
                                        <td>
                                            {
                                                this.state.seatsByParty[0]
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <input type="text" value={this.state.names[1]} onChange={(evt) => this.setName(evt.target.value, 1)} />
                                        </td>
                                        <td>
                                            <input type="color" value={this.state.colors[1]} onChange={(evt) => this.setColor(evt.target.value, 1)} />
                                        </td>
                                        <td>
                                            <input type="number" value={this.state.votes[1]} onChange={(evt) => this.setVotes(evt.target.value, 1)} />
                                        </td>
                                        <td>
                                            {
                                                this.state.seatsByParty[1]
                                            }
                                        </td>
                                    </tr>
                                    {
                                        [...Array(this.state.votes.length - 2)].map((_, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <button onClick={() => this.removeParty(i + 2)}>-</button>
                                                    </td>
                                                    <td>
                                                        <input type="text" value={this.state.names[i + 2]} onChange={(evt) => this.setName(evt.target.value, i + 2)} />
                                                    </td>
                                                    <td>
                                                        <input type="color" value={this.state.colors[i + 2]} onChange={(evt) => this.setColor(evt.target.value, i + 2)} />
                                                    </td>
                                                    <td>
                                                        <input type="number" value={this.state.votes[i + 2]} onChange={(evt) => this.setVotes(evt.target.value, i + 2)} />
                                                    </td>
                                                    <td>
                                                        {
                                                            this.state.seatsByParty[i + 2]
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr>
                                        <td>
                                            <button onClick={() => this.addParty()}>+</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='chart'>
                            <PieChart
                                width={450}
                                height={220}
                            >
                                <Pie
                                    data={seatData}
                                    dataKey="seats"
                                    nameKey="name"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={125}
                                    outerRadius={200}
                                    cx="50%"
                                    cy="100%"
                                >
                                    {
                                        seatData.map((_, index) => {
                                            return (
                                                <Cell key={`cell-${index}`} fill={this.state.colors[index]}/>
                                            )

                                        })
                                    }
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default App;
