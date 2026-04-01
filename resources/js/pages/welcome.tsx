import AppMasterContent from '@/components/app-master-content';
import AppMasterFooter from '@/components/app-master-footer';
import AppMasterHeader from '@/components/app-master-header';
import AppMasterSidebar from '@/components/app-master-sidebar';
import AppMainLayout from '@/layouts/app-main-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
      <AppMainLayout>
        <Head title="Bienvenido" />
        <div className="page-header">
            <div className="page-block">
              <div className="row align-items-center">
                <div className="col-md-12">
                  <div className="page-header-title">
                    <h5 className="m-b-10">Bienvenido</h5>
                  </div>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item"><a href="../dashboard/index.html">Home</a></li>
                    <li className="breadcrumb-item"><a href="javascript: void(0)">Other</a></li>
                    <li className="breadcrumb-item" aria-current="page">Sample Page</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
      

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h5>Hello card</h5>
                </div>
                <div className="card-body">
                </div>
              </div>
            </div>
          </div>
        </AppMainLayout>
    );
}