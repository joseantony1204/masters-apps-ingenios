export default function AppMasterFooter() {
    return (
        <>
            <footer className="pc-footer">
                <div className="footer-wrapper container-fluid">
                    <div className="row">
                        <div className="col-sm my-1">
                            <p className="m-0">Ingenios SAS &#9829; created by Team <a href="#" target="_blank">Ingenios SAS</a></p>
                        </div>
                        <div className="col-auto my-1">
                            <ul className="list-inline footer-link mb-0">
                                <li className="list-inline-item"><a href={route('dashboard')}>Inicio</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
