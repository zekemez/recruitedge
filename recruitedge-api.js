// RecruitEdge AI API Connection
// Add this script to your index.html before the closing </body> tag

const API_URL = 'https://recruitedge-ai-production.up.railway.app';

// Store athlete info globally
let savedAthleteInfo = null;

// ============================================
// AI COLLEGE FIT FINDER
// ============================================
async function runAIFitFinder() {
  const resultsDiv = document.getElementById('aiResults');
  
  // Gather form data
  const sport = document.getElementById('aiSport')?.value;
  const position = document.getElementById('aiPosition')?.value;
  const gradYear = document.getElementById('aiGradYear')?.value;
  const height = document.getElementById('aiHeight')?.value;
  const weight = document.getElementById('aiWeight')?.value;
  const gpa = document.getElementById('aiGpa')?.value;
  const stats = document.getElementById('aiStats')?.value;
  const tapeLink = document.getElementById('aiTapeLink')?.value;

  // Validation
  if (!sport || !position || !gradYear) {
    alert('Please fill in at least Sport, Position, and Graduation Year');
    return;
  }

  // Show loading state
  resultsDiv.style.display = 'block';
  resultsDiv.innerHTML = `
    <div style="text-align: center; padding: 2rem;">
      <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
      <p style="color: rgba(255,255,255,0.7);">AI is analyzing your profile...</p>
    </div>
  `;

  // Save athlete info for later use
  savedAthleteInfo = {
    name: document.getElementById('fullName')?.value || 'Athlete',
    email: document.getElementById('email')?.value || '',
    sport: sport,
    position: position,
    school: document.getElementById('schoolName')?.value || 'High School',
    grad_year: gradYear,
    gpa: gpa || 'Not provided',
    stats: stats || 'Not provided',
    highlights: tapeLink || 'Not provided'
  };

  // For now, show demo results (since we don't have a college matching endpoint yet)
  // In the future, this would call your API
  setTimeout(() => {
    resultsDiv.innerHTML = `
      <div style="background: rgba(0, 217, 255, 0.1); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 12px; padding: 1.5rem; margin-top: 1rem;">
        <h4 style="color: #00D9FF; margin-bottom: 1rem;">🎯 AI Analysis Complete</h4>
        <p style="color: rgba(255,255,255,0.8); margin-bottom: 1rem;">Based on your profile as a <strong>${position}</strong> in <strong>${sport}</strong>:</p>
        
        <div style="display: grid; gap: 1rem; margin-top: 1rem;">
          <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
            <strong style="color: white;">Division Fit:</strong>
            <span style="color: rgba(255,255,255,0.7);"> D1 (Reach) • D2 (Target) • D3 (Safety)</span>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
            <strong style="color: white;">Recommended Next Step:</strong>
            <span style="color: rgba(255,255,255,0.7);"> Start reaching out to D2 and D3 programs now</span>
          </div>
        </div>
        
        <button onclick="showPage('outreach')" class="primary-button" style="margin-top: 1.5rem; width: 100%;">
          📧 Start Coach Outreach →
        </button>
      </div>
    `;
  }, 2000);
}

// ============================================
// COACH OUTREACH - GENERATE EMAIL
// ============================================
async function generateCoachEmail() {
  const previewDiv = document.getElementById('emailPreview');
  const sendBtn = document.getElementById('sendEmailBtn');
  
  // Get coach info
  const coachName = document.getElementById('coachName')?.value;
  const collegeName = document.getElementById('collegeName')?.value;
  const coachEmail = document.getElementById('coachEmail')?.value;

  // Get athlete info (from saved or form)
  const athleteInfo = savedAthleteInfo || {
    name: document.getElementById('fullName')?.value || document.getElementById('outreachAthleteName')?.value || '',
    email: document.getElementById('email')?.value || document.getElementById('outreachAthleteEmail')?.value || '',
    sport: document.getElementById('aiSport')?.value || document.getElementById('outreachSport')?.value || '',
    position: document.getElementById('aiPosition')?.value || document.getElementById('outreachPosition')?.value || '',
    school: document.getElementById('schoolName')?.value || document.getElementById('outreachSchool')?.value || '',
    grad_year: document.getElementById('aiGradYear')?.value || document.getElementById('outreachGradYear')?.value || '',
    gpa: document.getElementById('aiGpa')?.value || document.getElementById('outreachGPA')?.value || '',
    stats: document.getElementById('aiStats')?.value || document.getElementById('outreachStats')?.value || '',
    highlights: document.getElementById('aiTapeLink')?.value || document.getElementById('outreachHighlights')?.value || ''
  };

  // Validation
  if (!coachName || !collegeName || !coachEmail) {
    alert('Please fill in coach name, college, and email');
    return;
  }

  if (!athleteInfo.name || !athleteInfo.sport || !athleteInfo.position) {
    alert('Please fill in your athlete information first (name, sport, position)');
    return;
  }

  // Show loading
  previewDiv.style.display = 'block';
  previewDiv.innerHTML = `
    <div style="text-align: center; padding: 2rem;">
      <div style="font-size: 2rem; margin-bottom: 1rem;">✍️</div>
      <p style="color: rgba(255,255,255,0.7);">AI is writing your personalized email...</p>
    </div>
  `;

  try {
    const response = await fetch(`${API_URL}/generate-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        athlete: athleteInfo,
        coach: {
          coach_name: coachName,
          college: collegeName,
          email: coachEmail
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate email');
    }

    const data = await response.json();
    
    // Store for sending
    window.generatedEmail = {
      subject: data.subject,
      body: data.body,
      coachEmail: coachEmail,
      athleteEmail: athleteInfo.email,
      athleteInfo: athleteInfo,
      coachInfo: {
        coach_name: coachName,
        college: collegeName,
        email: coachEmail
      }
    };

    // Show preview
    previewDiv.innerHTML = `
      <div style="background: rgba(0, 102, 255, 0.1); border: 1px solid rgba(0, 102, 255, 0.3); border-radius: 12px; padding: 1.5rem;">
        <h4 style="color: #0066FF; margin-bottom: 1rem;">📧 Generated Email Preview</h4>
        
        <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
          <p style="color: rgba(255,255,255,0.5); font-size: 0.85rem; margin-bottom: 0.5rem;">TO: ${coachEmail}</p>
          <p style="color: white; font-weight: 600; margin-bottom: 1rem;">SUBJECT: ${data.subject}</p>
          <div style="color: rgba(255,255,255,0.85); white-space: pre-wrap; line-height: 1.6;">${data.body}</div>
        </div>
        
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button onclick="sendGeneratedEmail()" id="sendEmailBtn" class="primary-button">
            ✉️ Send Email
          </button>
          <button onclick="generateCoachEmail()" class="secondary-button" style="background: rgba(255,255,255,0.1);">
            🔄 Regenerate
          </button>
        </div>
      </div>
    `;

  } catch (error) {
    console.error('Error:', error);
    previewDiv.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 1.5rem;">
        <h4 style="color: #ef4444; margin-bottom: 0.5rem;">❌ Error</h4>
        <p style="color: rgba(255,255,255,0.7);">Failed to generate email. Please try again.</p>
      </div>
    `;
  }
}

// ============================================
// COACH OUTREACH - SEND EMAIL
// ============================================
async function sendGeneratedEmail() {
  if (!window.generatedEmail) {
    alert('No email to send. Please generate one first.');
    return;
  }

  const btn = document.getElementById('sendEmailBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '⏳ Sending...';
  }

  try {
    const response = await fetch(`${API_URL}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to_email: window.generatedEmail.coachEmail,
        subject: window.generatedEmail.subject,
        body: window.generatedEmail.body,
        reply_to: window.generatedEmail.athleteEmail,
        athlete: window.generatedEmail.athleteInfo,
        coach: window.generatedEmail.coachInfo
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    const data = await response.json();

    if (data.success) {
      // Show success message
      const previewDiv = document.getElementById('emailPreview');
      previewDiv.innerHTML = `
        <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 1.5rem; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
          <h4 style="color: #22c55e; margin-bottom: 0.5rem;">Email Sent Successfully!</h4>
          <p style="color: rgba(255,255,255,0.7);">Your email to ${window.generatedEmail.coachInfo.coach_name} at ${window.generatedEmail.coachInfo.college} has been sent.</p>
          <p style="color: rgba(255,255,255,0.5); font-size: 0.85rem; margin-top: 1rem;">Lead #${data.lead_id} added to your tracker</p>
          
          <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; flex-wrap: wrap;">
            <button onclick="clearOutreachForm()" class="primary-button">
              📧 Send Another
            </button>
            <button onclick="showPage('progress')" class="secondary-button" style="background: rgba(255,255,255,0.1);">
              📊 View Leads
            </button>
          </div>
        </div>
      `;

      // Clear the stored email
      window.generatedEmail = null;
    }

  } catch (error) {
    console.error('Error:', error);
    alert('Failed to send email. Please try again.');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '✉️ Send Email';
    }
  }
}

// ============================================
// VIEW LEADS
// ============================================
async function loadLeads() {
  const leadsContainer = document.getElementById('leadsContainer');
  if (!leadsContainer) return;

  leadsContainer.innerHTML = `
    <div style="text-align: center; padding: 2rem;">
      <p style="color: rgba(255,255,255,0.7);">Loading leads...</p>
    </div>
  `;

  try {
    const response = await fetch(`${API_URL}/leads`);
    const leads = await response.json();

    if (leads.length === 0) {
      leadsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
          <p style="color: rgba(255,255,255,0.7);">No leads yet. Start reaching out to coaches!</p>
          <button onclick="showPage('outreach')" class="primary-button" style="margin-top: 1rem;">
            Start Outreach →
          </button>
        </div>
      `;
      return;
    }

    let html = '';
    leads.forEach(lead => {
      const statusColors = {
        'sent': '#3b82f6',
        'replied': '#22c55e',
        'no_response': '#f59e0b',
        'rejected': '#ef4444'
      };
      const statusEmojis = {
        'sent': '📤',
        'replied': '✅',
        'no_response': '⏳',
        'rejected': '❌'
      };

      html += `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h4 style="color: white; font-weight: 700;">${statusEmojis[lead.status] || '❓'} ${lead.coach_name}</h4>
              <p style="color: rgba(255,255,255,0.6); font-size: 0.9rem;">${lead.college}</p>
              <p style="color: rgba(255,255,255,0.5); font-size: 0.85rem;">${lead.coach_email}</p>
            </div>
            <div style="text-align: right;">
              <span style="background: ${statusColors[lead.status] || '#666'}20; color: ${statusColors[lead.status] || '#666'}; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                ${lead.status.replace('_', ' ').toUpperCase()}
              </span>
              <p style="color: rgba(255,255,255,0.4); font-size: 0.8rem; margin-top: 0.5rem;">Sent: ${lead.date_sent}</p>
            </div>
          </div>
          ${lead.notes ? `<p style="color: rgba(255,255,255,0.5); font-size: 0.85rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.1);">Notes: ${lead.notes}</p>` : ''}
          <div style="margin-top: 1rem;">
            <select onchange="updateLeadStatus(${lead.id}, this.value)" style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 0.5rem; border-radius: 6px; font-size: 0.85rem;">
              <option value="sent" ${lead.status === 'sent' ? 'selected' : ''}>📤 Sent</option>
              <option value="replied" ${lead.status === 'replied' ? 'selected' : ''}>✅ Replied</option>
              <option value="no_response" ${lead.status === 'no_response' ? 'selected' : ''}>⏳ No Response</option>
              <option value="rejected" ${lead.status === 'rejected' ? 'selected' : ''}>❌ Rejected</option>
            </select>
          </div>
        </div>
      `;
    });

    leadsContainer.innerHTML = html;

  } catch (error) {
    console.error('Error:', error);
    leadsContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <p style="color: rgba(255,255,255,0.7);">Failed to load leads. Please try again.</p>
      </div>
    `;
  }
}

// ============================================
// UPDATE LEAD STATUS
// ============================================
async function updateLeadStatus(leadId, newStatus) {
  try {
    await fetch(`${API_URL}/leads/${leadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    // Reload leads to show updated status
    loadLeads();
    
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to update status');
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function clearOutreachForm() {
  document.getElementById('coachName').value = '';
  document.getElementById('collegeName').value = '';
  document.getElementById('coachEmail').value = '';
  document.getElementById('emailPreview').style.display = 'none';
  document.getElementById('emailPreview').innerHTML = '';
}

// Load leads when progress page is shown
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the progress page
  const progressPage = document.getElementById('progress');
  if (progressPage) {
    // Create a mutation observer to detect when progress page becomes visible
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('active')) {
          loadLeads();
        }
      });
    });
    
    observer.observe(progressPage, { attributes: true, attributeFilter: ['class'] });
  }
});

console.log('RecruitEdge AI API connected! 🚀');
