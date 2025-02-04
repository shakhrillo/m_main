from chatgpt.extract_message import extract_message
from telethon import TelegramClient, events

# These example values won't work. You must get your own api_id and
# api_hash from https://my.telegram.org, under API Development.
api_id = 2597670
api_hash = 'b297821038840dd1d60a471f71105cd2'

client = TelegramClient('session_name', api_id, api_hash)

# group = 'https://t.me/+Bu_D8dsOlCUxNzc0'
group = 'https://t.me/Moxi0226'

messages = []

@client.on(events.NewMessage(chats=group))
async def handler(event):
    # write to group
    group = await event.get_chat()
    response = extract_message(event.message.text)
    await event.reply(response)

async def main():
    await client.start()
    print("Listening for new messages...")
    await client.run_until_disconnected()

client.loop.run_until_complete(main())
