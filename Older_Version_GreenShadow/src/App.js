import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Fields from './pages/Fields';
import Crops from './pages/CropsModel';
import Staff from './pages/Staff';
import Equipment from './pages/EquipmentModel';
import Vehicles from './pages/VehiclesModel';
import MonitoringLog from './pages/MonitoringLog';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/fields" component={Fields} />
                <Route path="/crops" component={Crops} />
                <Route path="/staff" component={Staff} />
                <Route path="/equipment" component={Equipment} />
                <Route path="/vehicles" component={Vehicles} />
                <Route path="/monitoring-log" component={MonitoringLog} />
            </Switch>
        </Router>
    );
}

export default App;
