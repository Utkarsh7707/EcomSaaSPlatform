export default function AuthLayout({children} : any)
{
    return (
        <div className="flex  justify-center items-center h-full">
            {children}
        </div>
    );
}