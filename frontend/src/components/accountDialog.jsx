import { Menu } from "@headlessui/react";
import { MdMoreVert } from "react-icons/md";
import { BiTransfer } from "react-icons/bi";
import TransitionWrapper from "./wrappers/transition-wrapper";

export default function AccountMenu({ addMoney, transferMoney }) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md text-sm font-medium text-gray-600">
                    <MdMoreVert />
                </Menu.Button>
            </div>

            <TransitionWrapper>
                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg p-2 z-10">
                    <div className="px-1 py-1 space-y-2">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={transferMoney}
                                    className={`group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm ${
                                        active ? 'bg-gray-100' : 'text-gray-700'
                                    }`}
                                >
                                    <BiTransfer /> Transfer Funds
                                </button>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={addMoney}
                                    className={`group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm ${
                                        active ? 'bg-gray-100' : 'text-gray-700'
                                    }`}
                                >
                                    <BiTransfer /> Add Money
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </TransitionWrapper>
        </Menu>
    );
}
