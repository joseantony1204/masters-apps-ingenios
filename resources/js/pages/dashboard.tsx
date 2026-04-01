import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppMainLayout from '@/layouts/app-main-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
      <AppMainLayout>
      <Head title="Bienvenido" />
        <div className="page-header">
          <div className="page-block">
            <div className="row align-items-center">
              <div className="col-md-12">
                <div className="page-header-title">
                  <h5 className="m-b-10">Sample Page</h5>
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
                OK
              </div>
            </div>
          </div>
        </div>
        </AppMainLayout>
    );
}
