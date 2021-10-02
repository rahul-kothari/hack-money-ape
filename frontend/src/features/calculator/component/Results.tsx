import * as React from 'react';
import { YTCOutput } from '../calculatorAPI';

interface Props {
    values: YTCOutput[]
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
                {values.map((value: YTCOutput) => {
                    return (
                        // TODO ytExposure isn't a great key
                        <tr key={value.ytExposure.toString()}>
                            <td>{value.ytExposure.toString()}</td>
                            <td>{value.remainingTokens.toString()}</td>
                            <td>{value.ethGasFees.toString()}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
}