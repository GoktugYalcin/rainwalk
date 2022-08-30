import {Button, Group} from "@mantine/core";
import {updateIsDrawerOpen} from "../modules/DrawerReducer";
import {IconRadar} from "@tabler/icons";
import React from "react";
import {useDispatch, useSelector} from "react-redux";

export const DrawerButton = () => {
    const dispatch = useDispatch()
    const isDrawerOpen = useSelector(state => state.isDrawerOpen)
    
    return <div className="rainwalk__button">
        <Group position="right">
            <Button color="teal"
                    disabled={isDrawerOpen}
                    radius="xl" size="lg"
                    onClick={() => dispatch(updateIsDrawerOpen(true))}
            >
                <IconRadar />
            </Button>
        </Group>
    </div>
}