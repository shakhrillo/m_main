# 
# This is working version of script 
# 
# 1. get TCP/IP Data
# 2. get USB Data
# 3. check this data
# 4. write data in db
#

import time
import serial
import socket
import sys
import smtplib
from pymongo import MongoClient
from termcolor import colored
from datetime import datetime
from email.mime.text import MIMEText



class SerialConnector:
    
    serial = ''
    
    def __init__(self, port='/dev/ttyUSB0', baudrate=9600):
        self.port = port
        self.baudrate = baudrate
        self.ser = self.connect()
        
        
    def connect(self):
        '''
            serial port configuration
        '''
        try:
            self.ser = serial.Serial(
                port = self.port,
                baudrate = self.baudrate,
                parity=serial.PARITY_NONE,
                stopbits=serial.STOPBITS_ONE,
                bytesize=serial.EIGHTBITS,
                timeout=1
            )
            
            # self.ser.open()
        except:
            print("SERIAL ERROR")
            self.ser = None

        return self.ser
    
    
    def serial_test(self):
        return self.ser
    
      
    def read_serial_data(self):
        ''' 
            reads and print data from serial port
        '''
    
        serial_data = 'error'
        
        result = {'status': 'error', 'serial_data': ''}
        attempts = 3
            
        while(attempts > 0):
            
            try:
                if(self.ser == None):
                    self.ser = self.connect()
                    time.sleep(1.0)
                    # CHECK IT AGAIN
                    if(self.ser == None):
                        print(colored(f" Read Failed: {self.port} ", 'grey', 'on_red'))
                        break
        
                if self.ser:
                    serial_data = self.ser.readline() # DECODE BYTE STRING TO STRING
                    serial_data = serial_data.decode('UTF-8').strip().replace("\r\n","")
                    

                    # IF GET SOME DATA, WAIT TCP DATA
                    if serial_data != '':
                        
                        bg_color = 'on_red'
                        message = serial_data
                        
                        result['data'] = serial_data
                        
                        if 'Grad  IO' in serial_data:
                            bg_color = 'on_green'
                            result['status'] = 'ok'
                        
                        elif len(serial_data.split(" ")) < 9 or 'undefined' in serial_data:
                            bg_color = 'on_red'
                            message = "NO READ"
                            result['status'] = 'error'
                        
                        elif 'ABBRUCH' in serial_data:
                            bg_color = 'on_red'
                            result['status'] = 'error'
                            
                        print(colored(f" {message} ", 'grey', bg_color))
                        
                        break
            except KeyboardInterrupt:
                print()
                print(colored("---------------------------------------", 'red'))
                print("> Script end")
                print(colored("---------------------------------------", 'red'))
                sys.exit()
                            
            except Exception as e:
                if(not(self.ser == None)):
                    self.ser.close()
                    self.ser = None
                    print(colored(f" Read Failed: {self.port} ", 'grey', 'on_red'))
                    # print(e)
                break
        
            attempts -= 1
            time.sleep(0.1)
            
        return result


class TcpConnector:
    
    def __init__(self, host, port):
        
        self.host = host
        self.port = port
        
        
    def tcp_test(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1.0)
        try:
            s.connect((self.host, self.port))
            recieved_data = 'ok'
        except:
            recieved_data = 'error'
        
        return recieved_data
            
            
    def read_tcp_data(self):       
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            # Add timeout
            # s.settimeout(1.0)
            
            # from socket import IPPROTO_TCP, SO_KEEPALIVE, TCP_KEEPIDLE, TCP_KEEPINTVL, TCP_KEEPCNT
            # s.setsockopt(socket.SOL_SOCKET, SO_KEEPALIVE, 1)
            # s.setsockopt(IPPROTO_TCP, TCP_KEEPIDLE, 1)
            # s.setsockopt(IPPROTO_TCP, TCP_KEEPINTVL, 1)
            # s.setsockopt(IPPROTO_TCP, TCP_KEEPCNT, 3)
            result = {'data': '', 'status': 'ok'}
            try:
                s.connect((self.host, self.port))
                data = s.recv(1024)
                recieved_data = data.decode('utf-8').strip().replace("\r\n","")
                
                # Assume recieved_data is a string
                # EXAMPLE
                # """
                #     0000L000000048
                #     0000
                #     @HHAR0530301#Cb#131945#T14524#S0000008#N01
                # """
                # start_index = recieved_data.find("@")
                # if start_index != -1:
                #     recieved_data = recieved_data[start_index + 1:].strip()
                #     print("Cleaned recieved data: ", recieved_data)
                # else:
                #     print("Starting sequence '@' not found.")
                
                result['data'] = recieved_data
                # EXAMPLE
                # HHAR2502301##Ca##131945##T04222##S0002129##N01
                # ['N01HHAR2502301', 'Ca', '131945', 'T04222', 'S0002130', 'N01']
                
                # CALCULATE DATA LENGTH
                data_length = len(recieved_data.split('#'))
                
                bg_color = 'on_green'
                message = recieved_data
                
                if data_length != 6: 
                    bg_color = 'on_blue'
                    message = "NO READ"
                    result['status'] = 'error'
            
                # IF RECEIVED DATA IS NOT EMPTY LINE PRINT THIS LINE
                if recieved_data != '':
                    print(colored(f" {message} ", 'grey', bg_color) , end='')
                    print(colored(' ++ ', 'blue', 'on_white'), end='')
                    sys.stdout.flush()

            except KeyboardInterrupt:
                print()
                print(colored("---------------------------------------", 'red'))
                print("> Script end")
                print(colored("---------------------------------------", 'red'))
                sys.exit()
            except:
                result['status'] = 'error'
        
        return result
        

class Db:
    
    def __init__(self, mongo_conn, database, collection):
        self.mongo_conn = mongo_conn
        self.database = database
        self.collection = collection
        self.coll = self.connect()

    def connect(self):
        '''
            mongodb configuration
            this configuration will be move in config file
        '''
       
        result = ''
        
        try:
            client = MongoClient(self.mongo_conn)
            db = client[self.database]
            result = db[self.collection]
            
            db.command("serverStatus")       
        except:
            result = 'error'
        
        return result
        
    def update_data_in_db(self, serial_data, tcp_data):
        
        result = 'ok'
        
        tcp_list = tcp_data.split("#")
        # EXAMPLE
        # ['N01HHAR2502301', 'Ca', '131945', 'T04222', 'S0002130', 'N01']
        
        search_dict = {
                "PartNo": tcp_list[0], 
                "PartIndex": tcp_list[1], 
                "SupplierID": int(tcp_list[2]), 
                "ManfDay": tcp_list[3],
                "SerialNo": tcp_list[4],
                "Cavity": tcp_list[5]
        }

        search_result = self.coll.find_one(search_dict)
        
        if search_result:
            try:
                update_vals = serial_data.split(" ")
                
                # STRING EXAMPLE  30.03.2022 12:15:53 PG:11 TQ:0.03 Nm AN:1861 Grad ABBRUCH
                #                 ['30.03.2022', '12:15:53', 'PG:11', 'TQ:0.03', 'Nm', 'AN:1861', 'Grad', 'ABBRUCH']
                # STRING EXAMPLE  30.03.2022 12:15:49 PG:11 TQ:3.49 Nm AN:10 Grad IO
                #                 ['30.03.2022', '12:15:49', 'PG:11', 'TQ:3.49', 'Nm', 'AN:10', 'Grad', 'IO']
                            
                # get keys and values will be next elements in list
                
                # GET EXISTING VALUES
                values = search_result.get('Measurement_Values', {})

                values['Date'] = update_vals[0]
                values['Time'] = update_vals[1]
                
                for data in update_vals:
                    if "PG:" in data:
                        values['PG'] = data.split(":")[-1]
                    elif "TQ:" in data:
                        values['TQ'] = data.split(":")[-1]
                    elif "AN:" in data:
                        values['AN'] = data.split(":")[-1]
                    

                
                # CREATE STRING COMMENT FROM LIST
                values['Comment'] = " ".join(update_vals[6:])
                
                # update existing value list
                # values.update(search_result['Measurement_Values'])
                # print(values)
                self.coll.update_one(search_dict, { "$set": { "Measurement_Values":  values }})
            except:
                # DATA NOT FOUND IN DB
                print(colored(' DB record update error ', 'grey', 'on_yellow'))
                result = 'not_found'
        else:
            # DATA NOT FOUND IN DB
            print(colored(' No entry in DB found ', 'grey', 'on_yellow'))
            result = 'not_found'
        
        return result


class Email:
    
    def __init__(self, smtp_server, smtp_port, smtp_user, smtp_pass):
        
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.smtp_user = smtp_user
        self.smtp_pass = smtp_pass
        
    def set_mail_data(self, sender, receiver, subject, message):
        self.sender = sender
        self.receiver = receiver
        self.subject = subject
        self.message = message
    
    
    def send_email(self, msg = ''):
        
        # DONT MAKE IDENTATION 
        if msg == '':
            msg = self.message
        
        try:
            msg = MIMEText(msg)
            msg['Subject'] = self.subject
            msg['From'] = self.sender
            msg['To'] = self.receiver
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.login(self.smtp_user, self.smtp_pass)
                server.sendmail(self.sender, self.receiver, msg.as_string())
            
            print(colored(' Email Sent ', 'grey', 'on_magenta'))
            
        except smtplib.SMTPResponseException as e:
            print(colored(' Email Not Sent ', 'grey', 'on_red'))
        except:
            print(colored(' Email Not Sent ', 'grey', 'on_red'))
       
    
    def test_email(self):
        result = 'ok'
        try:
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.login(self.smtp_user, self.smtp_pass)
        except:
            result = 'error'
        
        return result

              
    
  



def print_color_codes():

    print(colored("---------------------------------------", 'green'))
    print(colored("Color-codes:", attrs=['bold']))
    print(colored(" Green  ", "grey", "on_green") + ": Data OK")
    print(colored(" Red    ", "grey", "on_red") + ": Screwing error")
    print(colored(" Blue   ", "grey", "on_blue") + ": TCP/IP error")
    print(colored(" Yellow ", "grey", "on_yellow") + ": MongoDB error")
    print(colored("---------------------------------------", 'green'))
    
    

def check_connections(ser, tcp_con, db, email):
    
    # 1. CHECK SERIAL CONNECTION AND PRINT STATUS
    serial_status = "OK"
    serial_bg = "on_green" 
    
    if ser.serial_test() is None:
        serial_status = "NOK"
        serial_bg = "on_red"
        
    print("> USB connection:\t" + colored(f" {serial_status} ", 'grey', serial_bg))
    
    # 2. CHECK TCP CONNECTION AND PRINT STATUS
    tcp_data = tcp_con.tcp_test()
    tcp_status = "OK"
    tcp_bg = "on_green" 
    
    if tcp_data == 'error':
        tcp_status = "NOK"
        tcp_bg = "on_red" 
    
    print("> TCP/IP connection:\t" + colored(f" {tcp_status} ", 'grey', tcp_bg))
    
    # 3. DATABSE CONNECTION
    db_status = "OK"
    db_bg = "on_green" 
    
    # IF DATABASE CHECK IS OFF
    if db is not None:
        db_result = db.connect()
        
        if db_result == 'error':
            db_status = "NOK"
            db_bg = "on_red" 
        
        print("> DB connection:\t" + colored(f" {db_status} ", 'grey', db_bg))
        
    
    # 4. EMAIL CONNECTION
    email_status = "OK"
    email_bg = "on_green"
    
    # if email is not None:
    #     email_result = email.test_email()
        
    #     if email_result == 'error':
    #         email_status = "NOK"
    #         email_bg = "on_red" 
        
    #     print("> Email Login:\t\t" + colored(f" {email_status} ", 'grey', email_bg))
        
    
    result = 'ok'
        
    if serial_status == 'NOK' or tcp_status == 'NOK' or db_status == 'NOK' or email_status == 'NOK':
        result = 'error'
    
    return result
    

def check_error_data(get_data, error_data):
    if get_data == 'error':
        error_data['count'] += 1
    
    if error_data['count'] == 1:
        error_data['time'] = datetime.now()
    
    return error_data
    
  


def main(ser, tcp_con, db, email, error_frequency, error_time_period):

    '''
        listening to tcp and serial port
    '''

    tcp_data = None
    serial_data = None
    
    print_color_codes()
    
    
    print("Listening to TCP & USB data stream....")

    while(True):
        
        try:
            # READ TCP DATA
            tcp_data = tcp_con.read_tcp_data()
            # CHECK TCP DATA
            # error_data = check_error_data(tcp_data, error_data)
            
            
            if tcp_data['data'] != '':
                # READ SERAIL DATA
                serial_data = ser.read_serial_data()
                # CHECK SERIAL DATA
                # error_data = check_error_data(serial_data, error_data)
            else:
                print()
            

            # IF EMAIL IS CONFIGURED
            # if email is not None:
            # SEND EMAIL ON TCP CAMERA ERROR
            if tcp_data['status'] == 'error':
                msg = "Meldung: {} \r\n \r\n DMC: {} \r\n Screwdriver: {}".format("Kein DMC Wert lesbar", tcp_data['data'], serial_data['data'])
                email.send_email(msg)    
            
            
            # SEND EMAIL ON SERIAL SCREWDRIVER ERROR
            if serial_data['status'] == 'error':
                msg = "Meldung: {} \r\n \r\n DMC: {} \r\n Screwdriver: {}".format("Fehlerhafter Wert bei der Verschraubung!", tcp_data['data'], serial_data['data'])
                email.send_email(msg)  
            
            
            # CHECK DATA IN DB
            if ( serial_data['data'] != '' ) and ( tcp_data['status'] != 'error' ) and (db is not None):
                # UPDATE DATA IN DB
                                
                db_result = db.update_data_in_db(serial_data['data'], tcp_data['data'])
                
                # SEND EMAIL ON DATABASE NOT FOUND ERROR
                if db_result == 'not_found' and email == True:
                    msg = "Meldung: {} \r\n \r\n DMC: {} \r\n  Screwdriver: {}".format("Es gibt keinen Eintrag fuer diesen DMC-Code in der Datenbank.", tcp_data['data'], serial_data['data'])
                    email.send_email(msg)    
                # THIS MESSAGE MUST DEPEND ON DB UPDATE OR NOT
                # print(colored(' DB OK ', 'grey', 'on_green'))
            
            # GET ERROR MESSAGE

                
                    
                    
            
        except KeyboardInterrupt:
            print()
            print(colored("---------------------------------------", 'red'))
            print("> Script end")
            print(colored("---------------------------------------", 'red'))
            sys.exit()
                   
    time.sleep(0.1)



if __name__ == "__main__":
    print(colored("=======================================", 'green'))
    print("> Script start")
    print(colored("=======================================", 'green'))
    
    # CONFIGURATION
    # ====================================
    
    # TCP CONNECTION
    
    try:
        conf = sys.argv[1]
    except:
        conf = 'prod'


    if conf == 'dev':
        # NIKA
        host = '192.168.1.100'
        tcp_port = 6070
        
        # SERIAL CONNECTION
        serial_port='/dev/ttyUSB0'
        baudrate=9600
        
        # DB CONNECTION
        mongo_conn = ''
        database = ""
        collection = ""
        
        # EMAIL CONFIG
        smtp_server = ""
        smtp_port = 2525
        smtp_user = ""
        smtp_pass = ""
        #
        sender = ""
        receiver = ""
        subject = "Alert"
        message = "Can not read data"
    
        # True - write data in database
        # False - don't data in database
        write_db = True
        
        # True - send email
        # False - don't send email
        send_email = True
        
        # ERROR FREQUENCY 
        error_frequency = 3
        # ERROR TIME PERIOD in MINUTE
        error_time_period = 5
    
    elif conf == 'prod':
        # MARCO
        # TCP CONNECTION
        #host = ''
        host = ''
        tcp_port = 20371
        
        # SERIAL CONNECTION
        serial_port='/dev/ttyUSB0'
        baudrate=9600
        
        # DB CONNECTION
        mongo_conn = ''
        database = ""
        collection = ""
        
        # EMAIL CONFIG
        smtp_server = ""
        smtp_port = 25
        smtp_user = ""
        smtp_pass = ""
        #
        sender = ""
        receiver = ""
        subject = ""
        message = ""
        
        # True - write data in database
        # False - don't data in database
        write_db = True
        
        # True - send email
        # False - don't send email
        send_email =  True
        
         # ERROR FREQUENCY 
        error_frequency = 3
        # ERROR TIME PERIOD in MINUTE
        error_time_period = 5
    
    # END CONFIGURATION
    #=====================================
    
    # SERIAL
    serial_con = SerialConnector(serial_port, baudrate);
    
    # TCP
    tcp_con = TcpConnector(host, tcp_port)
    
    # MONG DB
    db = None
    if write_db:
        db = Db(mongo_conn, database, collection)
    
    email = None
    if send_email:
        email = Email(smtp_server, smtp_port, smtp_user, smtp_pass)
        email.set_mail_data(sender, receiver, subject, message)
    
    
    # CONNECTION RESULT
    result = check_connections(serial_con, tcp_con, db, email)
    
    # IF ALL CONNECTIONS ARE OK
    if result == 'ok':
                
        # RUN MAIN LOOP
        main(serial_con, tcp_con, db, email, error_frequency, error_time_period)
    else:
        print(colored("---------------------------------------", 'red'))
        print(colored('> Connection check failed...', 'red'))
        print(colored("---------------------------------------", 'red'))
        
