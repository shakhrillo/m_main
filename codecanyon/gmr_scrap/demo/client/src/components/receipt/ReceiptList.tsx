import { useEffect, useRef, useState, useCallback, JSX } from "react";
import { paymentsData } from "../../services/paymentService";
import type { Subscription } from "rxjs";
import { debounceTime, filter, map, Subject } from "rxjs";
import type { IDockerContainer } from "../../types/dockerContainer";
import { IconFilter, IconReload } from "@tabler/icons-react";
import { Stack, Button, Dropdown } from "react-bootstrap";
import { ReceiptData } from "./ReceiptData";
import type { IUserInfo } from "../../types/userInfo";
import { useOutletContext } from "react-router-dom";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "charge.succeeded", label: "Succeeded" },
  { value: "charge.failed", label: "Failed" },
];

const searchSubject = new Subject<string>();

/**
 * ReceiptList component
 * @returns {JSX.Element}
 */
export const ReceiptList = (): JSX.Element => {
  const user = useOutletContext<IUserInfo>();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [history, setHistory] = useState<IDockerContainer[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);

  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    const subscription = searchSubject
      .pipe(debounceTime(300))
      .subscribe(setSearch);
    return () => subscription.unsubscribe();
  }, []);

  const fetchReceipts = useCallback(
    (append = false, lastDocument = null) => {
      if (!user?.uid) return;

      subscriptionRef.current?.unsubscribe();

      subscriptionRef.current = paymentsData(
        {
          ...(user?.isAdmin ? {} : { uid: user?.uid }),
          type: status ? [status] : ["charge.succeeded", "charge.failed"],
        },
        lastDocument,
      )
        .pipe(
          filter((snapshot) => !!snapshot),
          map((snapshot) => {
            if (snapshot.empty) {
              setIsLastPage(true);
              return [];
            }

            setLastDoc(snapshot.docs.at(-1));
            if (snapshot.docs.length < 10) setIsLastPage(true);

            return snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as IDockerContainer),
            }));
          }),
        )
        .subscribe((data) => {
          setHistory((prev) => (append ? [...prev, ...data] : data));
        });
    },
    [user?.uid, user?.isAdmin, status],
  );

  const handleFilterChange = (value: string) => {
    setStatus(value);
    setLastDoc(null);
    setIsLastPage(false);
    setHistory([]);
    fetchReceipts();
  };

  useEffect(() => {
    fetchReceipts();
    return () => subscriptionRef.current?.unsubscribe();
  }, [search, status, fetchReceipts]);

  return (
    <div className="receipts-list">
      <Stack direction="horizontal" className="receipts-sort">
        <Dropdown autoClose="outside">
          <Dropdown.Toggle variant="outline-secondary">
            <IconFilter className="me-2" />
            Filter
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {FILTER_OPTIONS.map(({ value, label }) => (
              <Dropdown.Item
                key={value}
                onClick={() => handleFilterChange(value)}
                className={status === value ? "active" : ""}
              >
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Stack>

      {history.map((receipt) => (
        <ReceiptData key={receipt.id} receipt={receipt} />
      ))}

      {!isLastPage && (
        <Stack direction="horizontal" className="justify-content-center mt-3">
          <Button
            onClick={() => fetchReceipts(true, lastDoc)}
            variant="outline-primary"
          >
            <IconReload className="me-2" /> Load more
          </Button>
        </Stack>
      )}
    </div>
  );
};
