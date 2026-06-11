export default function PageContainer({
    children,
    className = ""
}) {

    return (

        <main
            className={`container ${className}`}>

            {children}

        </main>

    );

}