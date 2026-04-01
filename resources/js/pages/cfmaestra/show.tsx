import { useEffect } from 'react';


export default function Show() {  
    return (
     
        <table id="example" className="display nowrap">
        <thead>
            <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Offices</th>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Offices</th>
            </tr>
        </tfoot>
    </table>
    );
  }