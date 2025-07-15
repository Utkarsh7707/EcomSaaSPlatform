

interface HeadingProps{
    title : string
    description : string
};

export function Heading(props : HeadingProps)
{
    return(
        <div>
            <h2 className="text-3xl font-bold tracking-tight">
                {props.title}
            </h2>
            <p className="text-muted-foreground">
                {props.description}
            </p>
        </div>
    );
}