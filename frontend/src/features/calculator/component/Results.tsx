import * as React from 'react';
import { CalculatorResult } from '../calculatorAPI';

interface Props {
    values: CalculatorResult[]
}


export const Results: React.FC<Props> = (props) => {
    const {values} = props;

    return <div>
        <table className="table-auto">
            <thead>
                <th>YT Exposure</th>
                <th>Net Gain</th>
                <th>Final APR</th>
            </thead>
            <tbody>
                {values.map((value: CalculatorResult) => {
                    return (
                        // TODO ytExposure isn't a great key
                        <tr key={value.ytExposure}>
                            <td>{value.ytExposure}</td>
                            <td>{value.netGain}</td>
                            <td>{value.finalAPR}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
}