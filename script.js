// script.js - ONLY JAVASCRIPT CONTENT
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Data Source Definition
    const roomsData = [
        { name: "D8 101", type: "Ruang Kelas", status: "Kosong", time: "07.00–09.35" },
        { name: "D8 103", type: "Ruang Kelas", status: "Kosong", time: "07.00–09.35" },
        { name: "D8 210", type: "Ruang Kelas", status: "Terpakai", time: "07.00–09.35" },
        { name: "D8 305", type: "Ruang Kelas", status: "Kosong", time: "07.00–09.35" },
        { name: "D11 203", type: "Ruang Kelas", status: "Terpakai", time: "07.00–09.35" },
        { name: "D12 401", type: "Ruang Kelas", status: "Kosong", time: "07.00–09.35" }
    ];

    const allRoomsContainer = document.getElementById("all-rooms-container");
    const emptyRoomsContainer = document.getElementById("empty-rooms-container");

    // 2. Component Generation Logic (Preserving the exact visual UI requested)
    function createRoomCard(room, isHighlight = false) {
        const isKosong = room.status === "Kosong";
        const badgeBg = isKosong ? "bg-green-100" : "bg-red-100";
        const badgeText = isKosong ? "text-green-700" : "text-red-700";
        
        // Exact original visual hierarchy restored, plus interactive logic hooks
        const cardBg = isHighlight ? "bg-blue-50/50" : "bg-white";

        return `
            <div data-room="${room.name}" class="room-card cursor-pointer ${cardBg} border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-28">
                <div class="flex justify-between items-start pointer-events-none">
                    <div>
                        <p class="text-[11px] text-slate-500 font-medium mb-0.5">${room.type}</p>
                        <h4 class="text-base font-bold text-slate-800 leading-tight">${room.name}</h4>
                    </div>
                    <span class="text-[11px] px-2.5 py-1 rounded-md font-semibold ${badgeBg} ${badgeText}">
                        ${room.status}
                    </span>
                </div>
                <div class="text-[13px] text-slate-600 font-medium mt-auto pointer-events-none">
                    ${room.time}
                </div>
            </div>
        `;
    }

    // 3. Render Initialization
    function renderDashboard() {
        allRoomsContainer.innerHTML = roomsData.map(room => createRoomCard(room)).join('');
        const emptyRooms = roomsData.filter(room => room.status === "Kosong");
        emptyRoomsContainer.innerHTML = emptyRooms.map(room => createRoomCard(room, true)).join('');
    }

    renderDashboard();

    // 4. Modal Interactivity Logic
    const modal = document.getElementById("room-modal");
    const modalContent = document.getElementById("modal-content");

    function openModal(roomName) {
        const room = roomsData.find(r => r.name === roomName);
        if (!room) return;

        // Populate modal text
        document.getElementById("modal-title").innerText = room.name;
        document.getElementById("modal-type").innerText = room.type;
        document.getElementById("modal-time").innerText = room.time;
        
        const statusBadge = document.getElementById("modal-status");
        statusBadge.innerText = room.status;
        
        if(room.status === "Kosong") {
            statusBadge.className = "px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700";
        } else {
            statusBadge.className = "px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700";
        }

        // Show and animate modal (Display block -> Trigger Reflow -> Set Opacity/Scale)
        modal.classList.remove("hidden");
        // Trigger a reflow flush so the browser registers the element before transition
        void modal.offsetWidth;
        modal.classList.remove("opacity-0");
        modalContent.classList.remove("scale-95");
        modalContent.classList.add("scale-100");
    }

    function closeModal() {
        modal.classList.add("opacity-0");
        modalContent.classList.remove("scale-100");
        modalContent.classList.add("scale-95");
        
        // Wait for CSS transition duration before hiding display
        setTimeout(() => {
            modal.classList.add("hidden");
        }, 300); 
    }

    // Event Delegation: Listen for clicks on dynamically generated room cards
    document.addEventListener("click", (e) => {
        const card = e.target.closest(".room-card");
        if (card) {
            openModal(card.getAttribute("data-room"));
        }
    });

    // Close Modals events
    document.getElementById("close-modal-icon").addEventListener("click", closeModal);
    document.getElementById("close-modal-btn").addEventListener("click", closeModal);

    // Close modal when clicking outside the content box
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });


    // 5. Filter Interactivity Logic
    // Function properly designed to swap class strings without destroying layout
    function setupFilterToggle(groupId, activeClasses, inactiveClasses) {
        const container = document.getElementById(groupId);
        if(!container) return;
        
        const buttons = container.querySelectorAll(".filter-btn");
        
        buttons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const target = e.currentTarget;
                
                // Reset all sibling buttons
                buttons.forEach(b => {
                    b.classList.remove(...activeClasses);
                    b.classList.add(...inactiveClasses);
                    b.classList.remove("active");
                    
                    // Hide embedded status badges (like 'ACTIVE' inside Gedung)
                    const badge = b.querySelector('.status-badge');
                    if(badge) badge.classList.add('hidden');
                });

                // Set clicked button to active
                target.classList.remove(...inactiveClasses);
                target.classList.add(...activeClasses);
                target.classList.add("active");
                
                const badge = target.querySelector('.status-badge');
                if(badge) badge.classList.remove('hidden');
            });
        });
    }

    // Initialize Filter Toggles with specific color schemes to preserve design
    const stdActive = ["bg-blue-500", "text-white", "border-blue-500", "shadow-sm"];
    const stdInactive = ["bg-white", "text-slate-600", "border-slate-200", "hover:border-blue-400"];
    
    setupFilterToggle("filter-jam", stdActive, stdInactive);
    setupFilterToggle("filter-fakultas", stdActive, stdInactive);
    
    const gedungActive = ["bg-blue-100", "text-blue-700", "border-blue-200", "font-semibold", "shadow-sm"];
    const gedungInactive = ["bg-white", "text-slate-600", "border-slate-200", "font-medium", "hover:border-blue-400"];
    setupFilterToggle("filter-gedung", gedungActive, gedungInactive);
    
    // Jenis ruangan has opacity rules
    const jenisActive = ["bg-white", "border-slate-300", "shadow-sm", "text-slate-800"];
    const jenisInactive = ["bg-white", "border-slate-200", "text-slate-600", "opacity-60", "hover:opacity-100"];
    setupFilterToggle("filter-jenis", jenisActive, jenisInactive);

});