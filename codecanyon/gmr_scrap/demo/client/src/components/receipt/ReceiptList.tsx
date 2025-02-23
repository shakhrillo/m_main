import { useEffect, useState } from "react";
import { paymentsData } from "../../services/paymentService";
import { getAuth } from "firebase/auth";
import { debounceTime, filter, map, Subject, take } from "rxjs";
import { IDockerContainer } from "../../types/dockerContainer";
import { IconFilter, IconReload } from "@tabler/icons-react";
import { Stack, Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import { ReceiptData } from "./ReceiptData";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "charge.succeeded", label: "Succeeded" },
  { value: "charge.failed", label: "Failed" },
];

interface IReceiptList {
  uid: string;
}

const searchSubject = new Subject<string>();

export const ReceiptList = ({ uid }: IReceiptList) => {
  const auth = getAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const [history, setHistory] = useState([] as any[]);

  useEffect(() => {
    const subscription = searchSubject.pipe(debounceTime(300)).subscribe((value) => {
      setSearch(value);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchReceipts = (append = false, lastDocument = null) => {
    if (!auth.currentUser?.uid) return;

    return paymentsData({
      // uid,
      type: status ? [status] : ["charge.succeeded", "charge.failed"],
    }, lastDocument).pipe(
      filter((snapshot) => !!snapshot),
      map((snapshot) => {
        if (snapshot.empty) {
          setIsLastPage(true);
          return [];
        }
        
        if (snapshot.docs.length < 10) setIsLastPage(true);

        setLastDoc(snapshot.docs.at(-1));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as IDockerContainer }));
      }),
      take(1),
    ).subscribe((data) => {
      setHistory((prev) => (append ? [...prev, ...data] : data));
    });
  };

  useEffect(() => {
    setLastDoc(null);
    setIsLastPage(false);
    setHistory([]);
    const subscription = fetchReceipts();
    return () => subscription?.unsubscribe();
  }, [search, status]);

  const loadMore = () => {
    if (!isLastPage) fetchReceipts(true, lastDoc);
  };
  
  return (
    <div className="receipts-list">
      <Stack direction="horizontal" className="receipts-sort">
        <Dropdown autoClose="outside">
          <Dropdown.Toggle variant="outline-secondary">
            <IconFilter className="me-2" />
            Filter
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {FILTER_OPTIONS.map((option) => (
              <Dropdown.Item
                key={option.label}
                onClick={() => setStatus(option.value)}
                className={status === option.value ? "active" : ""}
              >{ option.label }</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Stack>

      {history.map((receipt) => <ReceiptData key={receipt.id} receipt={receipt} />)}

      {
        !isLastPage && (
          <Stack direction="horizontal" className="justify-content-center mt-3">
            <Button onClick={loadMore} variant="outline-primary">
              <IconReload className="me-2" /> Load more
            </Button>
          </Stack>
        )
      }
    </div>
  );
};