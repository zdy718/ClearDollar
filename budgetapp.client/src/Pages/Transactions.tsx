import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../Components/Navbar";
import { FileUploader } from "../Components/FileUpload";

type TransactionDto = {
    transactionId: number;
    tagId: number | null;
    date: string;
    amount: number;
    merchantDetails: string;
};

type TagDto = {
    tagId: number;
    parentTagId: number | null;
    tagName: string;
    budgetAmount: number;
    tagType: 1 | 2; // income=1, expense=2
};

export function TransactionsPage() {
    const USER_ID = localStorage.getItem("userId")!;


    const [transactions, setTransactions] = useState<TransactionDto[] | undefined>(undefined);
    const [tags, setTags] = useState<TagDto[] | undefined>(undefined);

    const [saveStatus, setSaveStatus] = useState<
        { kind: "ok"; message: string } | { kind: "err"; message: string } | null
    >(null);

    useEffect(() => {
        void Promise.all([populateTransactions(), populateTags()]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Optional: stable label lookup for rendering current tag name quickly
    const tagNameById = useMemo(() => {
        const m = new Map<number, string>();
        (tags ?? []).forEach((t) => m.set(t.tagId, t.tagName));
        return m;
    }, [tags]);

    async function patchTransactionTag(transactionId: number, tagId: number | null) {
        const res = await fetch(`/transactions/${transactionId}/tag?userId=${encodeURIComponent(USER_ID)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tagId }),
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `Update failed: ${res.status}`);
        }
    }

    const contents =
        transactions === undefined || tags === undefined ? (
            <p className="text-center">
                <em>
                    Loading... Please refresh once the ASP.NET backend has started. See{" "}
                    <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a>{" "}
                    for more details.
                </em>
            </p>
        ) : (
            <div className="d-flex justify-content-center">
                <table
                    className="table mx-auto border-separate border-spacing-x-6"
                    aria-labelledby="tableLabel"
                >
                    <thead>
                        <tr>
                            <th className="px-2 text-left">TransactionId</th>
                            <th className="px-2 text-left">Tag</th>
                            <th className="px-2 text-left">Date</th>
                            <th className="px-2 text-left">Amount</th>
                            <th className="px-2 text-left">MerchantDetails</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.transactionId}>
                                <td className="px-2">{tx.transactionId}</td>

                                {/* Tag editor */}
                                <td className="px-2">
                                    <select
                                        className="px-2 py-1 text-xs border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
                                        value={tx.tagId ?? ""}
                                        onChange={(e) => {
                                            const raw = e.target.value;
                                            const nextTagId = raw === "" ? null : Number(raw);

                                            setSaveStatus(null);

                                            // optimistic UI
                                            setTransactions((prev) =>
                                                (prev ?? []).map((p) =>
                                                    p.transactionId === tx.transactionId
                                                        ? { ...p, tagId: nextTagId }
                                                        : p
                                                )
                                            );

                                            patchTransactionTag(tx.transactionId, nextTagId)
                                                .then(() => setSaveStatus({ kind: "ok", message: "Transaction tag updated." }))
                                                .catch((err) => {
                                                    setSaveStatus({
                                                        kind: "err",
                                                        message: err?.message ?? "Failed to update transaction tag.",
                                                    });
                                                    populateTransactions();
                                                });
                                        }}
                                    >
                                        <option value="">(Unassigned)</option>
                                        {tags.map((t) => (
                                            <option key={t.tagId} value={t.tagId}>
                                                {t.tagName} (#{t.tagId})
                                            </option>
                                        ))}
                                    </select>

                                </td>

                                <td className="px-2">{tx.date}</td>
                                <td className="px-2">{tx.amount}</td>
                                <td className="px-2">{tx.merchantDetails}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

                    {/* Top actions */}
                    <div className="bg-white border rounded-2xl p-4">
                        <div className="flex items-center justify-center gap-4">
                            <FileUploader />
                        </div>
                    </div>

                    {/* Main table card */}
                    <div className="bg-white border rounded-2xl p-4">
                        <h1 id="tableLabel" className="text-center text-lg font-semibold">
                            All Transactions
                        </h1>
                        {contents}
                    </div>

                </div>
            </div>
        </>
    );

    async function populateTransactions() {
        const response = await fetch(`/transactions?userId=${encodeURIComponent(USER_ID)}`);
        if (response.ok) {
            const data = (await response.json()) as TransactionDto[];
            setTransactions(data);
        } else {
            setTransactions([]);
        }
    }

    async function populateTags() {
        const response = await fetch(`/tags?userId=${encodeURIComponent(USER_ID)}`);
        if (response.ok) {
            const data = (await response.json()) as TagDto[];
            setTags(data);
        } else {
            setTags([]);
        }
    }
}
