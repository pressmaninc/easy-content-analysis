import { PanelRow } from '@wordpress/components';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import './result.css'

const Result = props => {

    const res = props.res;

    return (
        res.error ? <Error log={res.log} /> : <Success data={res.data} />
    );
}

const Error = props => {

    const log = props.log;

    return (
        <PanelRow className={'error-message'}>
            <p>ERROR {log.status}:<br/>
            {log.message}</p>
        </PanelRow>
    );
}

const Success = props => {

    const data = [
        { name: 'positive', value: props.data.pos},
        { name: 'neutral', value: props.data.mid},
        { name: 'negative', value: props.data.neg},
    ];

    const colors = ['#ffab64', '#aaaaaa', '#5b9adb'];

    const totalLines = props.data.totalLines;

    return (
        <div className={'flex-container'}>
            <div className={'parcentages'}>
                <ul>
                    {data.map((e, i) => {
                        const parcentage = Math.round((e.value / totalLines) * 100);
                        return (
                            <li className={`item-${i} bold`} key={`${i}`}>
                                {`${e.name}:`}<span style={{ float: 'right'}}>{parcentage + '%'}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className={'chart'}>
                <ResponsiveContainer>
                <PieChart>
                <Pie
                    data={data}
                    innerRadius={30}
                    outerRadius={45}
                    cx={'50%'}
                    cy={'50%'}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
                </Pie>
                </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Result;
