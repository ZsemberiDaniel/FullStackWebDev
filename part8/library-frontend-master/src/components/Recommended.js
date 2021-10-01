import { useQuery } from "@apollo/client";
import React from "react";
import { ME } from "../queries";

const Recommended = (props) => {
    const me = useQuery(ME);

    if (!props.show) {
        return null;
    }

    if (!props.token) {
        return <div>Login to see recommendations!</div>
    }

    // if (props.result.loading) {
    //     return (
    //         <div>
    //             Loading...
    //         </div>
    //     );
    // }

    const favoriteGenre = me.data.me.favoriteGenre;

    return (
        <div>
            <h2>recommendations</h2>
            <p>books in your favorite genre: <b>{favoriteGenre}</b></p>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>
                            author
                        </th>
                        <th>
                            published
                        </th>
                    </tr>
                    {props.allBooks
                        .filter(a => a.genres.includes(favoriteGenre))
                        .map(a =>
                            <tr key={a.title}>
                                <td>{a.title}</td>
                                <td>{a.author.name}</td>
                                <td>{a.published}</td>
                            </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
};

export default Recommended;
