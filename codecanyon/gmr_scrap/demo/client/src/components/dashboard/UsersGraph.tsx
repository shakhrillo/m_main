import { Card } from "react-bootstrap";
import { LineChart } from "../LineChart";
import { useState, useEffect } from "react";
import { usersList } from "../../services/settingService";
import { formatTotalUsers } from "../../utils/formatTotalUsers";

/**
 * Users component
 */
export const UsersGraph = () => {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const subscribtion = usersList().subscribe((users) => {
            // setUsers(formatTotalUsers(users));
        });

        return () => {
            subscribtion.unsubscribe();
        };
    }, []);

    return (
        <Card>
            <Card.Body>
                <Card.Title>This month's users</Card.Title>
                <LineChart
                    labels={users.map((e) => e.date)}
                    datasets={[{
                        label: "This month's users",
                        data: users.map((e) => e.total),
                        color: "#3e2c41",
                    }]}
                />
            </Card.Body>
        </Card>
    )
};