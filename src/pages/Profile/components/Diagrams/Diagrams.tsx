import { useState } from 'react';
import { Switcher } from '../../../../components/Switcher/Switcher';
import './Diagrams.css';
import { BasicTable } from '../Table/Table';
import { LikesChart } from '../LikesChart/LikesChart';
import { CommentsChart } from '../CommentsChart/CommentsChart';

export function Diagrams() {
    const [diagram, setDiagram] = useState('table');
    const toggleDiagram = () => {
        if (diagram === 'table') {
            setDiagram('chart');
        } else {
            setDiagram('table');
        }
    };
    return (
        <>
            <label className="diagram-switcher">
                <Switcher onClick={toggleDiagram} />
                <p>{diagram === 'table' ? 'Table view' : 'Chart view'}</p>
            </label>
            <div className="diagrams-container">
                <div className="diagram">
                    <h3>Likes</h3>
                    {diagram === 'table' ? <BasicTable /> : <LikesChart />}
                </div>
                <div className="diagram">
                    <h3>Comments</h3>
                    {diagram === 'table' ? <BasicTable /> : <CommentsChart />}
                </div>
            </div>
        </>
    );
}
