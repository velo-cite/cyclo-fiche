<?php
     $to      = 'adrien.loxq@gmail.com';
     $subject = 'Test mail prod velocite';
     $message = 'Ceci est un test';
     $headers = 'From: testmail@velo-cite.org' . "\r\n" .
     'Reply-To: testmail@velo-cite.org' . "\r\n" .
     'X-Mailer: PHP/' . phpversion();

     mail($to, $subject, $message, $headers);
 ?>