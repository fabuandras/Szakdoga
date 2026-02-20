export default function AdminHomePage() {
    return (
        <div className="container-fluid py-3">
            <div className="row">
                <aside className="col-md-3 mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title text-bg-secondary p-3">Felhasználók kezelése</h5>
                            <nav>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Új felhasználó</li>
                                    <li className="list-group-item">Szerepkörök</li>
                                    <li className="list-group-item">Fiókok inaktiválása</li>
                                    <li className="list-group-item">Jelszóbeállítás</li>
                                    <li className="list-group-item">Aktiválási napló</li>
                                </ul>
                            </nav>
                            <h5 className="card-title text-bg-secondary p-3">Termékek kezelése</h5>
                            <nav>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Új termék</li>
                                    <li className="list-group-item">Árak módosítása</li>
                                    <li className="list-group-item">Kategóriák</li>
                                    <li className="list-group-item">Státuszok</li>
                                    <li className="list-group-item">Törölt termékek</li>
                                </ul>
                            </nav>
                            <h5 className="card-title text-bg-secondary p-3">Rendszerbeállítás</h5>
                            <nav>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Beállítások</li>
                                    <li className="list-group-item">Jogosultságok</li>
                                    <li className="list-group-item">Karbantartás</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </aside>

                <main className="col-md-9">

                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <div className="card h-100 text-center">
                                <div className="card-body d-flex flex-column justify-content-center">
                                    <h5 className="card-title">Új Termék </h5>
                                    <button className="btn btn-primary mt-2">Hozzáad</button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card h-100 text-center">
                                <div className="card-body d-flex flex-column justify-content-center">
                                    <h5 className="card-title">Felhasználók Kezelése</h5>
                                    <button className="btn btn-outline-primary mt-2">Kezelés</button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card h-100 text-center">
                                <div className="card-body d-flex flex-column justify-content-center">
                                    <h5 className="card-title">Vélemények </h5>
                                    <button className="btn btn-outline-danger mt-2">Moderál</button>
                                </div>
                            </div>
                        </div>
                    </div>




                    <footer className="mt-4 border-top pt-3 text-muted">&lt;footer&gt; Itt lesz a footer! </footer>
                </main>
            </div>
        </div>
    );
}
