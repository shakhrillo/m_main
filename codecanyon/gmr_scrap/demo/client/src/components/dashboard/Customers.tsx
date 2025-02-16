import { Card } from "react-bootstrap";
import { LineChart } from "../LineChart";
import { useState, useEffect } from "react";
import { allUsers } from "../../services/settingService";
import { formatTotalUsers } from "../../utils/formatTotalUsers";

/**
 * Customers component for the current month
 * @returns The customers component
 */
export const Customers = () => {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const subscribtion = allUsers().subscribe((users) => {
            console.log('f users', formatTotalUsers(users));
            setUsers(formatTotalUsers(users));
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