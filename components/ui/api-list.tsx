'use client';

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApitAlert } from "./api-alert";



interface APIListProps{
    entityName :string
    entityIdName :string
}
export function ApiList(props : APIListProps)
{
    const params = useParams();
    const origin = useOrigin();

    const baseUrl = `${origin}/api/${params.storeId}`
    return (
        <div>
            <ApitAlert title="GET"
            variant="public"
            description={`${baseUrl}/${props.entityName}`}
            />
            <ApitAlert title="GET"
            variant="public"
            description={`${baseUrl}/${props.entityName}/{${props.entityIdName}}`}
            />
            <ApitAlert title="POST"
            variant="admin"
            description={`${baseUrl}/${props.entityName}`}
            />
            <ApitAlert title="PATCH"
            variant="admin"
            description={`${baseUrl}/${props.entityName}/{${props.entityIdName}}`}
            />
            <ApitAlert title="DELETE"
            variant="admin"
            description={`${baseUrl}/${props.entityName}/{${props.entityIdName}}`}
            />
        </div>
    );
}