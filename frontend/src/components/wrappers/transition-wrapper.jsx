import {Transition} from "@headlessui/react";
import React ,{Fragment} from "react";

const TransitionWrapper = ({children})=>{
    return (
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 translate-y-2"
            enterTo="transform opacity-100 translate-y-0"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
        >
            {children}
        </Transition>

    )
};

export default TransitionWrapper;