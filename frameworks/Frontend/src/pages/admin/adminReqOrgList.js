import React from "react";
import SideNav from "../../components/admin/sideNav";
import OrganizationRequestList from "../../components/admin/organizationRequestList";
import NavButton from "../../components/admin/orgrequestlist/NavButton";

export default function RequestedOrganizations (){

    return(
        <>
            <NavButton/>
            <SideNav reqorglist="true"/>
            <OrganizationRequestList/>
        </>
    )
}