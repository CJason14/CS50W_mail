document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}

function send_mail() {
  fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.getElementById('compose-recipients').value,
        subject: document.getElementById('compose-subject').value,
        body: document.getElementById('compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result);
    });
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.getElementById('email-view').innerHTML = "";

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if(mailbox == "inbox"){
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);
      let count = 0;
      for (const email in emails) {
        const email_div = document.createElement("div");
        email_div.classList.add('email');
        const id = emails[count].id;
        email_div.addEventListener('click', function () {
          load_email(id)
        });

        const title = document.createElement("h4");
        const title_content = document.createTextNode(emails[count].subject);
        title.appendChild(title_content);

        const sent = document.createElement("p");
        const sent_content = document.createTextNode("Sender: " + emails[count].sender)
        sent.appendChild(sent_content);

        const time = document.createElement("p");
        const time_content = document.createTextNode("Time: " + emails[count].timestamp)
        time.appendChild(time_content);

        const archive = document.createElement("button");
        const archive_content = document.createTextNode("Archive")
        archive.appendChild(archive_content);
        const fetch_content = '/emails/' + emails[count].id
        archive.addEventListener('click', function () {
          fetch(fetch_content, {
              method: 'PUT',
              body: JSON.stringify({
                archived: "True"
              })
            })
            .then(response => response.json())
            .then(result => {
              // Print result
              console.log(result);
            });
          window.location.reload();
        });

        email_div.appendChild(title);
        email_div.appendChild(sent);
        email_div.appendChild(time);
        if (emails[count].read == true) {
          email_div.classList.add('gray');
        }
        if (emails[count].archived == false) {
          email_div.appendChild(archive)
          document.getElementById('emails-view').appendChild(email_div);
        }
        count++;
      }
    });
  } else if (mailbox == "archive"){
    fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);
      let count = 0;
      for (const email in emails) {
        const email_div = document.createElement("div");
        email_div.classList.add('email');
        const id = emails[count].id;
        email_div.addEventListener('click', function () {
          load_email(id)
        });

        const title = document.createElement("h4");
        const title_content = document.createTextNode(emails[count].subject);
        title.appendChild(title_content);

        const sent = document.createElement("p");
        const sent_content = document.createTextNode("Sender: " + emails[count].sender)
        sent.appendChild(sent_content);

        const time = document.createElement("p");
        const time_content = document.createTextNode("Time: " + emails[count].timestamp)
        time.appendChild(time_content);

        const archive = document.createElement("button");
        const archive_content = document.createTextNode("Unarchive")
        archive.appendChild(archive_content);
        const fetch_content = '/emails/' + emails[count].id
        archive.addEventListener('click', function () {
          fetch(fetch_content, {
              method: 'PUT',
              body: JSON.stringify({
                archived: "False"
              })
            })
            .then(response => response.json())
            .then(result => {
              // Print result
              console.log(result);
            });
          window.location.reload();
        });

        email_div.appendChild(title);
        email_div.appendChild(sent);
        email_div.appendChild(time);
        if (email.read == true) {
          email_div.classList.add('gray');
        }
        if (emails[count].archived == true) {
          email_div.appendChild(archive)
          document.getElementById('emails-view').appendChild(email_div);
        }
        count++;
      }
    });
  } else if (mailbox == "sent"){
    fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);
      let count = 0;
      for (const email in emails) {
        const email_div = document.createElement("div");
        email_div.classList.add('email');
        const id = emails[count].id;
        email_div.addEventListener('click', function () {
          load_email(id)
        });

        const title = document.createElement("h4");
        const title_content = document.createTextNode(emails[count].subject);
        title.appendChild(title_content);

        const sent = document.createElement("p");
        const sent_content = document.createTextNode("Sender: " + emails[count].sender)
        sent.appendChild(sent_content);

        const time = document.createElement("p");
        const time_content = document.createTextNode("Time: " + emails[count].timestamp)
        time.appendChild(time_content);

        email_div.appendChild(title);
        email_div.appendChild(sent);
        email_div.appendChild(time);
        document.getElementById('emails-view').appendChild(email_div);
        count++;
      }
    });
  }
  
}

function load_email(id){

    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'block';

    const email_id = '/emails/' + id;

    fetch(email_id, {
      method: 'PUT',
      body: JSON.stringify({
        read: "True"
      })
    })
    .then(answer => answer.json())
    .then(result => {
      // Print result
      console.log(result);
    });

    fetch(email_id)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);
      const email_div = document.createElement("div");

      const title = document.createElement("h4");
      const title_content = document.createTextNode(emails.subject);
      title.appendChild(title_content);

      const sent = document.createElement("h6");
      const sent_content = document.createTextNode("Sender: " + emails.sender)
      sent.appendChild(sent_content);

      const recipients = document.createElement("h6");
      const recipients_content = document.createTextNode("Recipient: " + emails.recipients[0])
      recipients.appendChild(recipients_content);

      const content = document.createElement("p");
      const content_content = document.createTextNode(emails.body)
      content.appendChild(content_content);

      const time = document.createElement("p");
      const time_content = document.createTextNode("Time: " + emails.timestamp)
      time.appendChild(time_content);

      const reply = document.createElement("button");
      const reply_content = document.createTextNode("Reply")
      reply.appendChild(reply_content);
      reply.addEventListener('click', function () {
          // Show compose view and hide other views
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'block';
          document.querySelector('#email-view').style.display = 'none';

          // Clear out composition fields
          document.querySelector('#compose-recipients').value = emails.sender;
          document.querySelector('#compose-subject').value = 'Re:' + emails.subject;
          document.querySelector('#compose-body').value = 'On ' + emails.timestamp + ' ' + emails.sender + ' wrote: ' + emails.body;
        
      });

      email_div.appendChild(title);
      email_div.appendChild(sent);
      email_div.appendChild(recipients);
      email_div.appendChild(content);
      email_div.appendChild(time);
      email_div.appendChild(reply);
      document.getElementById('email-view').appendChild(email_div);
      }
    );

}