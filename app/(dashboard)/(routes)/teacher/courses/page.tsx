import { Button } from '../../../../../components/ui/button';
import Link from 'next/link';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

async function getData(): Promise<any[]> {
    // Fetch data from your API here.
    return [
      {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
      },
      // ...
    ]
  }

const CoursesPage = async () => {
    const data = await getData();
    return ( 
        <div className="p-6">
            <Link href="/teacher/create">
                <Button>
                    New course
                </Button>
            </Link>
            <DataTable columns={columns} data={data} />

        </div>
     );
}
 
export default CoursesPage;